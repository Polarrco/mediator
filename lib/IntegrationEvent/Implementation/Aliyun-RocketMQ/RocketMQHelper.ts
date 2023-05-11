import { IntegrationEventSubscriptionManager } from "../../IntegrationEventSubscriptionManager";
import { IntegrationEvent } from "../../IntegrationEvent";
import * as AliyunMQ from "@aliyunmq/mq-http-sdk";
import { jsonDateReviver } from "../../../Helper/jsonDateReviver";
import { getEvent } from "../../../Helper/getEvent";
import { handleEvent } from "../../../Helper/handleEvent";
import { undefinedEventName } from "../../../Helper/undefinedEventName";
import { WrappedNodeRedisClient } from "handy-redis";
import { Connection } from "mongoose";

interface RocketMQMessage {
  MessageId: string;
  MessageTag?: string;
  MessageBody: string;

  PublishTime: string;
  NextConsumeTime: string;
  FirstConsumeTime: string;
  ConsumedTimes: string;
  MessageKey: string;

  ReceiptHandle: string;

  Properties: {
    eventName: string;
    [i: string]: any;
  };
}

export interface RocketMQOptions {
  accessKeyId: string;
  accessKeySecret: string;
  endpoint: string;
  instanceId: string;
  topic: string;
  groupId: string;
}

interface RocketMQProducerPublishResponse {
  code: number;
  requestId: string;
  body: {
    MessageId: string;
    MessageBodyMD5: string;
  };
}

interface RocketMQProducer {
  publishMessage: (message: string, tag?: string, messageProperties?: any) => Promise<RocketMQProducerPublishResponse>;
}

interface RocketMQConsumerConsumeMessagesResponse {
  code: number;
  requestId: string;
  body: RocketMQMessage[];
}

interface RocketMQConsumerAckMessagesResponse {
  code: number;
  requestId: string;
  body: {
    ReceiptHandle: string;
    ErrorCode: number;
    ErrorMessage: string;
  }[];
}

interface RocketMQConsumer {
  consumeMessage: (
    batchSize: number,
    pollingDelayInSeconds: number
  ) => Promise<RocketMQConsumerConsumeMessagesResponse>;
  ackMessage: (receiptHandles: string[]) => Promise<RocketMQConsumerAckMessagesResponse>;
}

/**
 * The naming convention for SQS queue is Service-[ServiceName].
 *
 * One Service can only have one queue, all messages inside this queue will be filtered before going inside
 * so all of them should be processed by consumer service properly.
 */
export class RocketMQHelper {
  private client: {
    getProducer: (instanceId: string, topicName: string) => RocketMQProducer;
    getConsumer: (instanceId: string, topicName: string, groupId: string) => RocketMQConsumer;
  };
  private producer: RocketMQProducer;
  private consumer: RocketMQConsumer;
  private stopConsuming: boolean = true;
  private isConsuming: boolean = false;

  constructor(options: RocketMQOptions) {
    this.client = new AliyunMQ.MQClient(options.endpoint, options.accessKeyId, options.accessKeySecret);
    this.producer = this.client.getProducer(options.instanceId, options.topic);
    this.consumer = this.client.getConsumer(options.instanceId, options.topic, options.groupId);
  }

  async publish(event: IntegrationEvent): Promise<RocketMQProducerPublishResponse> {
    const msgProperties = new AliyunMQ.MessageProperties();
    msgProperties.putProperty("eventName", event.eventName || undefinedEventName);
    return this.producer.publishMessage(JSON.stringify(event), "", msgProperties);
  }

  async stopConsumer(): Promise<void> {
    this.stopConsuming = true;
    return new Promise((resolve) => {
      const interval = setInterval(() => {
        if (!this.isConsuming) {
          clearInterval(interval);
          resolve();
        }
      }, 1000);
    });
  }

  async startConsumer(options: {
    batchSize: number;
    pollingDelayInSeconds: number;
    subscriptionManager: IntegrationEventSubscriptionManager;
    RedisClient?: WrappedNodeRedisClient;
    MongoDBConnection?: Connection;
  }): Promise<void> {
    if (this.consumer) {
      this.stopConsuming = false;
      while (!this.stopConsuming) {
        try {
          const consumeResponse = await this.consumer.consumeMessage(options.batchSize, options.pollingDelayInSeconds);

          if (consumeResponse.code === 200) {
            this.isConsuming = true;
            const handles = consumeResponse.body.map((message) => {
              return message.ReceiptHandle;
            });
            const ackResponse = await this.consumer.ackMessage(handles);
            let ackedHandles: string[] = [];
            let failedToAckHandles: string[] = [];
            if (ackResponse.code !== 204) {
              failedToAckHandles = ackResponse.body.map((error) => {
                return error.ReceiptHandle;
              });
              handles.forEach((handle) => {
                if (failedToAckHandles.indexOf(handle) < 0) {
                  ackedHandles.push(handle);
                }
              });
            } else {
              ackedHandles = handles;
            }
            const results = await Promise.allSettled(
              consumeResponse.body
                .filter((message) => ackedHandles.includes(message.ReceiptHandle))
                .map((message) => {
                  const subscription = options.subscriptionManager.getSubscriptionForEvent(
                    message.Properties.eventName
                  );
                  if (!subscription) {
                    console.log(`There is no subscription for this event: ${message.Properties.eventName}.`);
                    return;
                  }
                  try {
                    const event = getEvent(subscription, JSON.parse(message.MessageBody, jsonDateReviver));
                    if (event) {
                      return handleEvent({
                        event,
                        subscription,
                        RedisClient: options.RedisClient,
                        MongoDBConnection: options.MongoDBConnection,
                      });
                    }
                  } catch (error) {
                    console.log(`Could not construct event: ${message.Properties.eventName}`, error);
                  }
                })
            );
            results.forEach((result) => {
              if (result.status !== "fulfilled") {
                console.log("Handle integration event error:", result.reason);
              }
            });
          }
        } catch (error: any) {
          if (error.Code.indexOf("MessageNotExist") > -1) {
            // Continue the next poll
          } else {
            console.log("Unexpected error while polling messages", error);
          }
        }
        this.isConsuming = false;
      }
    }
  }
}
