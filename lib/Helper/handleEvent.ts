import { IntegrationEventSubscription } from "../IntegrationEvent/IntegrationEventSubscriptionManager";
import { IntegrationEvent } from "../IntegrationEvent/IntegrationEvent";
import { WrappedNodeRedisClient } from "handy-redis";
import { RedisHelper } from "./RedisHelper";
import { jsonDateReviver } from "./jsonDateReviver";
import { Connection } from "mongoose";
import { canStartProcessingEvent } from "./MongoDBDeduplicationHelper";

export async function handleEvent(options: {
  event: IntegrationEvent;
  subscription: IntegrationEventSubscription;
  RedisClient?: WrappedNodeRedisClient;
  MongoDBConnection?: Connection;
}): Promise<void> {
  let event = options.event;
  if (options.RedisClient) {
    const canExecute = await RedisHelper.canStartEventExecution({ event: event, RedisClient: options.RedisClient });
    if (canExecute) {
      if (event.queueId) {
        let eventName: string;
        let eventDataParsed: any;
        let eventDataString = await RedisHelper.fetchNextEvent({
          queueId: event.queueId,
          RedisClient: options.RedisClient,
        });
        while (eventDataString) {
          eventDataParsed = JSON.parse(eventDataString, jsonDateReviver);
          eventName = eventDataParsed.eventName;
          event = eventDataParsed;
          if (event && event.queueId) {
            await executeEventHandlers(options.subscription, event);
            eventDataString = await RedisHelper.fetchNextEvent({
              queueId: event.queueId,
              RedisClient: options.RedisClient,
            });
          } else {
            break;
          }
        }
      } else {
        await executeEventHandlers(options.subscription, event);
      }
    } else {
      // drop event
    }
  } else if (options.MongoDBConnection) {
    const canStart = await canStartProcessingEvent(options.MongoDBConnection, event.integrationEventId);
    if (canStart) {
      await executeEventHandlers(options.subscription, event);
    } else {
      // drop event
    }
  } else {
    await executeEventHandlers(options.subscription, event);
  }
}

async function executeEventHandlers(
  subscription: IntegrationEventSubscription,
  event: IntegrationEvent
): Promise<void> {
  if (subscription.handlers.length > 0) {
    const results = await Promise.allSettled(subscription.handlers.map((handler) => handler.handle(event)));
    results.forEach((result) => {
      if (result.status !== "fulfilled") {
        console.log(`Handle integration event error: ${result.reason}`);
      }
    });
  }
}
