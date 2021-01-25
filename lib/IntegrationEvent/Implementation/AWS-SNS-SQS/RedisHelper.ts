import { IntegrationEvent } from "../../IntegrationEvent";
import { WrappedNodeRedisClient } from "handy-redis";

export class RedisHelper {
  public static async storeEventData(options: {
    event: IntegrationEvent;
    RedisClient: WrappedNodeRedisClient;
  }): Promise<void> {
    if (options.RedisClient && options.RedisClient.nodeRedis.connected && options.event && options.event.queueId) {
      try {
        const hashKey = `{${options.event.queueId}}_data`;
        const sortedSetKey = `{${options.event.queueId}}_queue`;
        const masterSetKey = `master_event_queue`;
        const eventId = options.event.integrationEventId;
        const eventData = JSON.stringify(options.event);
        const score = new Date().getTime();
        await options.RedisClient.multi()
          .zadd(sortedSetKey, [score, eventId])
          .hsetnx(hashKey, eventId, eventData)
          .exec();
        await options.RedisClient.zadd(masterSetKey, "NX", [score, sortedSetKey]);
      } catch (error) {
        console.log(`Error while saving event to Redis: ${options.event.integrationEventId}`);
      }
    }
  }

  public static async canStartEventExecution(options: {
    event: IntegrationEvent;
    RedisClient: WrappedNodeRedisClient;
  }): Promise<boolean> {
    if (options.RedisClient && options.RedisClient.nodeRedis.connected && options.event && options.event.queueId) {
      const activeSetKey = `{${options.event.queueId}}_active`;
      const activeEventKey = `{${options.event.queueId}}_${options.event.integrationEventId}_active`;
      const keysExist = await options.RedisClient.exists(activeEventKey, activeSetKey);
      if (keysExist > 0) {
        return false;
      }
    }
    return true;
  }

  public static async fetchNextEvent(options: {
    queueId: string;
    RedisClient: WrappedNodeRedisClient;
  }): Promise<string | undefined> {
    if (options.RedisClient && options.RedisClient.nodeRedis.connected && options.queueId) {
      const activeSetKey = `{${options.queueId}}_active`;
      const hashKey = `{${options.queueId}}_data`;
      const sortedSetKey = `{${options.queueId}}_queue`;
      const eventIdList = await options.RedisClient.zpopmin(sortedSetKey, 1);
      let activeEventKey;
      if (eventIdList.length > 0) {
        const eventId = eventIdList[0];
        const eventDataString = await options.RedisClient.hget(hashKey, eventId);
        activeEventKey = `{${options.queueId}}_${eventId}_active`;
        if (eventDataString) {
          await options.RedisClient.multi()
            .setnx(activeSetKey, "1")
            .setnx(activeEventKey, "1")
            .expire(activeEventKey, 120)
            .exec();
          return eventDataString;
        }
      } else {
        await options.RedisClient.multi()
          .del(sortedSetKey, hashKey, activeSetKey)
          .exec();
        const queueIdList = await options.RedisClient.zpopmin(`master_event_queue`, 1);
        if (queueIdList.length > 0) {
          return await RedisHelper.fetchNextEvent({ RedisClient: options.RedisClient, queueId: queueIdList[0] });
        }
      }
    }
  }
}
