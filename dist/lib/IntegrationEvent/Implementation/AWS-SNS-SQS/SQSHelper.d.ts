import { SQS } from "aws-sdk";
import { Consumer } from "sqs-consumer";
import { IntegrationEventSubscriptions } from "../../IntegrationEventSubscriptionManager";
import { WrappedNodeRedisClient } from "handy-redis";
export declare class SQSHelper {
  static bundleQueueWithSubscriptions(options: {
    SQSClient: SQS;
    SQSUrl: string;
    getSubscriptions: () => IntegrationEventSubscriptions;
    RedisClient?: WrappedNodeRedisClient;
    batchSize?: number;
    visibilityTimeout?: number;
  }): Consumer;
  private static jsonDateReviver;
  private static handleEvent;
  private static getEventData;
  private static executeEventHandlers;
}
//# sourceMappingURL=SQSHelper.d.ts.map
