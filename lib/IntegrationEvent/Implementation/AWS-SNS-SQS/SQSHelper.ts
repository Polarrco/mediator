import { SQS } from "aws-sdk";
import { isDate, isValid, parseJSON } from "date-fns";
import { Consumer } from "sqs-consumer";
import { IntegrationEventSubscriptions } from "../../IntegrationEventSubscriptionManager";

interface SQSMessage {
  EventName: string; // Set by MessageAttributes
  EventBody: object; // Set by Message
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
    batchSize?: number;
    visibilityTimeout?: number;
  }): Consumer {
    const consumer = Consumer.create({
      sqs: options.SQSClient,
      queueUrl: options.SQSUrl,
      batchSize: options.batchSize || 1,
      visibilityTimeout: options.visibilityTimeout || undefined,
      handleMessage: async message => {
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
          const subscription = [...subscriptions.entries()].find(
            ([eventConstructor]) => eventConstructor.name === parsedBody.EventName
          );

          if (!subscription) {
            throw new Error(`There is no subscription respecting to this event: ${parsedBody.EventName}.`);
          }

          // Construct event entity
          const [eventConstructor, eventHandlers] = subscription;
          if (!eventConstructor || !eventHandlers || eventHandlers.length === 0) {
            throw new Error(`There is no event handler respecting to this event: ${parsedBody.EventName}.`);
          } else {
            const event = new eventConstructor(parsedBody.EventBody);
            for (const handler of eventHandlers) {
              await handler.handle(event);
            }
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
}
