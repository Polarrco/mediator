import { SQS } from "aws-sdk";
import { Consumer } from "sqs-consumer";
import { IntegrationEventSubscriptions } from "../../IntegrationEventSubscriptionManager";
export declare class SQSHelper {
  static bundleQueueWithSubscriptions(options: {
    SQSClient: SQS;
    SQSUrl: string;
    getSubscriptions: () => IntegrationEventSubscriptions;
    batchSize?: number;
    visibilityTimeout?: number;
  }): Consumer;
  private static jsonDateReviver;
}
//# sourceMappingURL=SQSHelper.d.ts.map
