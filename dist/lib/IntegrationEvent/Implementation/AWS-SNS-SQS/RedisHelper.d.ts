import { IntegrationEvent } from "../../IntegrationEvent";
import { WrappedNodeRedisClient } from "handy-redis";
export declare class RedisHelper {
  static storeEventData(options: { event: IntegrationEvent; RedisClient: WrappedNodeRedisClient }): Promise<void>;
  static canStartEventExecution(options: {
    event: IntegrationEvent;
    RedisClient: WrappedNodeRedisClient;
  }): Promise<boolean>;
  static fetchNextEvent(options: { queueId: string; RedisClient: WrappedNodeRedisClient }): Promise<string | undefined>;
}
//# sourceMappingURL=RedisHelper.d.ts.map
