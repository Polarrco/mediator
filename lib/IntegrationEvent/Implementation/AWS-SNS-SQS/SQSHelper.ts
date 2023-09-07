import { Consumer } from "sqs-consumer";
import { IntegrationEventSubscriptionManager } from "../../IntegrationEventSubscriptionManager";
import { WrappedNodeRedisClient } from "handy-redis";
import { jsonDateReviver } from "../../../Helper/jsonDateReviver";
import { handleEvent } from "../../../Helper/handleEvent";
import { getEvent } from "../../../Helper/getEvent";
import { Connection } from "mongoose";
import { SQSClient } from "@aws-sdk/client-sqs";

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
    SQSClient: SQSClient;
    SQSUrl: string;
    subscriptionManager: IntegrationEventSubscriptionManager;
    RedisClient?: WrappedNodeRedisClient;
    MongoDBConnection?: Connection;
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
            console.log(`There is no subscription for this event: ${parsedBody.EventName}.`);
            return;
          }

          // Put discover logic in here to support dynamically add more subscriptions through applications.
          try {
            const event = getEvent(subscription, parsedBody.EventBody);
            if (event) {
              await handleEvent({
                event,
                subscription,
                RedisClient: options.RedisClient,
                MongoDBConnection: options.MongoDBConnection,
              });
            }
          } catch (error) {
            console.log(`Could not construct event: ${parsedBody.EventName}`, error);
          }
        }
      },
    });

    consumer.start();

    return consumer;
  }
}
