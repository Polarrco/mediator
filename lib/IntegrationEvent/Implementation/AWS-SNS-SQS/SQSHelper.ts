import { SQS } from "aws-sdk";
import { Consumer } from "sqs-consumer";
import {
  IntegrationEventSubscription,
  IntegrationEventSubscriptionManager,
} from "../../IntegrationEventSubscriptionManager";
import { WrappedNodeRedisClient } from "handy-redis";
import { RedisHelper } from "./RedisHelper";
import { jsonDateReviver } from "../../../Helper/jsonDateReviver";
import { executeEventHandlers } from "../../../Helper/executeWithEventHandlers";
import { getEvent } from "../../../Helper/getEvent";

interface SQSMessage {
  EventName: string; // Set by MessageAttributes
  EventBody: Record<string, any>; // Set by Message
  TimestampParsed: Date; // Set by Timestamp

  Type: string;
  MessageId: string;
  TopicArn: string;
  Subject: string;
  Message: string;
  Timestamp: string;
  SignatureVersion: number;
  Signature: string;
  MessageAttributes: {
    "event-name": {
      Type: string;
      Value: string;
    };
    [i: string]: any;
  };
}

/**
 * The naming convention for SQS queue is Service-[ServiceName].
 *
 * One Service can only have one queue, all messages inside this queue will be filtered before going inside
 * so all of them should be processed by consumer service properly.
 */
export class SQSHelper {
  public static bundleQueueWithSubscriptions(options: {
    SQSClient: SQS;
    SQSUrl: string;
    subscriptionManager: IntegrationEventSubscriptionManager;
    RedisClient?: WrappedNodeRedisClient;
    batchSize?: number;
    visibilityTimeout?: number;
  }): Consumer {
    const consumer = Consumer.create({
      sqs: options.SQSClient,
      queueUrl: options.SQSUrl,
      batchSize: options.batchSize || 1,
      visibilityTimeout: options.visibilityTimeout || undefined,
      handleMessage: async (message) => {
        if (message.Body) {
          let parsedBody: SQSMessage;
          try {
            parsedBody = JSON.parse(message.Body);
            parsedBody.TimestampParsed = new Date(parsedBody.Timestamp);
            parsedBody.EventName = parsedBody.MessageAttributes["event-name"]["Value"];
            parsedBody.EventBody = JSON.parse(parsedBody.Message, jsonDateReviver);
          } catch (error) {
            console.log(`Parse integration event error: ${error}`);
            throw error;
          }

          const subscription = options.subscriptionManager.getSubscriptionForEvent(parsedBody.EventName);

          if (!subscription) {
            throw new Error(`There is no subscription for this event: ${parsedBody.EventName}.`);
          }

          // Put discover logic in here to support dynamically add more subscriptions through applications.
          try {
            await SQSHelper.handleEvent(parsedBody, subscription, options.RedisClient);
          } catch (error) {
            console.log(`Handle integration event error: ${error}`);
          }
        }
      },
    });

    consumer.start();

    return consumer;
  }

  private static async handleEvent(
    parsedBody: SQSMessage,
    subscription: IntegrationEventSubscription,
    RedisClient?: WrappedNodeRedisClient
  ): Promise<void> {
    let event = getEvent(subscription, parsedBody.EventBody);

    if (event) {
      if (RedisClient) {
        const canExecute = await RedisHelper.canStartEventExecution({ event: event, RedisClient: RedisClient });
        if (canExecute && event.queueId) {
          let eventName: string;
          let eventDataParsed: any;
          let eventDataString = await RedisHelper.fetchNextEvent({
            queueId: event.queueId,
            RedisClient: RedisClient,
          });
          while (eventDataString) {
            eventDataParsed = JSON.parse(eventDataString, jsonDateReviver);
            eventName = eventDataParsed.eventName;
            event = eventDataParsed;
            if (event && event.queueId) {
              await executeEventHandlers(subscription, event);
              eventDataString = await RedisHelper.fetchNextEvent({
                queueId: event.queueId,
                RedisClient: RedisClient,
              });
            } else {
              break;
            }
          }
        } else {
          await executeEventHandlers(subscription, event);
        }
      } else {
        await executeEventHandlers(subscription, event);
      }
    }
  }
}
