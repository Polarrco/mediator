"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class RedisHelper {
    static async storeEventData(options) {
        if (options.RedisClient && options.RedisClient.nodeRedis.connected && options.event && options.event.queueId) {
            try {
                const hashKey = `data:{${options.event.queueId}}`;
                const sortedSetKey = `queue:{${options.event.queueId}}`;
                const masterSetKey = `queue:master`;
                const eventId = options.event.integrationEventId;
                const eventData = JSON.stringify(options.event);
                const score = new Date().getTime();
                await options.RedisClient.multi()
                    .zadd(sortedSetKey, [score, eventId])
                    .hsetnx(hashKey, eventId, eventData)
                    .exec();
                await options.RedisClient.zadd(masterSetKey, "NX", [score, sortedSetKey]);
            }
            catch (error) {
                console.log(`Error while saving event to Redis: ${options.event.integrationEventId}`);
            }
        }
    }
    static async canStartEventExecution(options) {
        if (options.RedisClient && options.RedisClient.nodeRedis.connected && options.event && options.event.queueId) {
            const activeSetKey = `active:queue:{${options.event.queueId}}`;
            const activeEventKey = `active:event:{${options.event.queueId}}_${options.event.integrationEventId}`;
            const keysExist = await options.RedisClient.exists(activeEventKey, activeSetKey);
            if (keysExist > 0) {
                return false;
            }
        }
        return true;
    }
    static async fetchNextEvent(options) {
        if (options.RedisClient && options.RedisClient.nodeRedis.connected && options.queueId) {
            const activeSetKey = `active:queue:{${options.queueId}}`;
            const hashKey = `data:{${options.queueId}}`;
            const sortedSetKey = `queue:{${options.queueId}}`;
            const eventIdList = await options.RedisClient.zpopmin(sortedSetKey, 1);
            let activeEventKey;
            if (eventIdList.length > 0) {
                const eventId = eventIdList[0];
                const eventDataString = await options.RedisClient.hget(hashKey, eventId);
                activeEventKey = `active:event:{${options.queueId}}_${eventId}`;
                if (eventDataString) {
                    await options.RedisClient.multi()
                        .setnx(activeSetKey, "1")
                        .setnx(activeEventKey, "1")
                        .expire(activeEventKey, 120)
                        .exec();
                    return eventDataString;
                }
            }
            else {
                await options.RedisClient.multi()
                    .del(sortedSetKey, hashKey, activeSetKey)
                    .exec();
                await options.RedisClient.zpopmin(`queue:master`, 1);
            }
        }
    }
}
exports.RedisHelper = RedisHelper;
//# sourceMappingURL=RedisHelper.js.map