import { SQS } from "aws-sdk";
import { isDate, isValid, parseJSON } from "date-fns";
import { Consumer } from "sqs-consumer";
import { IntegrationEventSubscriptions } from "../../IntegrationEventSubscriptionManager";
import { WrappedNodeRedisClient } from "handy-redis";
import { RedisHelper } from "./RedisHelper";
import { IntegrationEvent } from "../../IntegrationEvent";
import { ConstructorType } from "../../../Helper/ConstructorType";
import { IntegrationEventHandler } from "../../IntegrationEventHandler";

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
    getSubscriptions: () => IntegrationEventSubscriptions;
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
            parsedBody.EventBody = JSON.parse(parsedBody.Message, SQSHelper.jsonDateReviver);
          } catch (error) {
            console.log(`Parse integration event error: ${error}`);
            throw error;
          }

          const subscriptions = options.getSubscriptions();

          // Put discover logic in here to support dynamically add more subscriptions through applications.
          try {
            await SQSHelper.handleEvent(parsedBody, subscriptions, options.RedisClient);
          } catch (error) {
            console.log(`Handle integration event error: ${error}`);
          }
        }
      },
    });

    consumer.start();

    return consumer;
  }

  private static jsonDateReviver(key: string, value: any) {
    if (typeof value === "string") {
      const date = parseJSON(value);
      if (isDate(date) && isValid(date)) {
        return date;
      }
    }

    return value;
  }

  private static async handleEvent(
    parsedBody: SQSMessage,
    subscriptions: IntegrationEventSubscriptions,
    RedisClient?: WrappedNodeRedisClient
  ): Promise<void> {
    const subscriptionNameMap: Map<
      string,
      {
        eventConstructor: ConstructorType<IntegrationEvent>;
        eventHandlers: IntegrationEventHandler<IntegrationEvent>[];
      }
    > = new Map(
      [...subscriptions.entries()].map((entry) => [
        entry[0].name,
        { eventConstructor: entry[0], eventHandlers: entry[1] },
      ])
    );

    let eventData = SQSHelper.getEventData(subscriptionNameMap, parsedBody.EventName, parsedBody.EventBody);

    if (eventData) {
      if (RedisClient) {
        const canExecute = await RedisHelper.canStartEventExecution({ event: eventData, RedisClient: RedisClient });
        if (canExecute && eventData.queueId) {
          let eventName: string;
          let eventDataParsed: any;
          let eventDataString = await RedisHelper.fetchNextEvent({
            queueId: eventData.queueId,
            RedisClient: RedisClient,
          });
          while (eventDataString) {
            eventDataParsed = JSON.parse(eventDataString, SQSHelper.jsonDateReviver);
            eventName = eventDataParsed.eventName;
            eventData = eventDataParsed;
            if (eventData && eventData.queueId) {
              await SQSHelper.executeEventHandlers(subscriptionNameMap, eventName, eventData);
              eventDataString = await RedisHelper.fetchNextEvent({
                queueId: eventData.queueId,
                RedisClient: RedisClient,
              });
            } else {
              break;
            }
          }
        } else {
          await SQSHelper.executeEventHandlers(subscriptionNameMap, parsedBody.EventName, eventData);
        }
      } else {
        await SQSHelper.executeEventHandlers(subscriptionNameMap, parsedBody.EventName, eventData);
      }
    }
  }

  private static getEventData(
    subscriptionNameMap: Map<
      string,
      {
        eventConstructor: ConstructorType<IntegrationEvent>;
        eventHandlers: IntegrationEventHandler<IntegrationEvent>[];
      }
    >,
    eventName: string,
    eventData: any
  ): IntegrationEvent | undefined {
    let event = undefined;
    if (subscriptionNameMap.has(eventName)) {
      const subscription = subscriptionNameMap.get(eventName);
      if (subscription && subscription.eventConstructor) {
        event = new subscription.eventConstructor(eventData);
      }
    }
    return event;
  }

  private static async executeEventHandlers(
    subscriptionNameMap: Map<
      string,
      {
        eventConstructor: ConstructorType<IntegrationEvent>;
        eventHandlers: IntegrationEventHandler<IntegrationEvent>[];
      }
    >,
    eventName: string,
    eventData: IntegrationEvent
  ): Promise<void> {
    if (subscriptionNameMap.has(eventName)) {
      const subscription = subscriptionNameMap.get(eventName);
      if (subscription && subscription.eventHandlers && subscription.eventHandlers.length > 0) {
        for (const handler of subscription.eventHandlers) {
          await handler.handle(eventData);
        }
      }
    }
  }
}
