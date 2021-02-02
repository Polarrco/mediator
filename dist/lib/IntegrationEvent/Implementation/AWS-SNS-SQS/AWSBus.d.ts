import { OnModuleDestroy } from "@nestjs/common";
import { IntegrationEvent } from "../../IntegrationEvent";
import { IntegrationEventBus } from "../../IntegrationEventBus";
import { EventBus_Usage } from "../../IntegrationEventModuleOptions";
import { IntegrationEventSubscriptionManager } from "../../IntegrationEventSubscriptionManager";
export interface AWSIntegrationEventBusOptions {
  usage?: EventBus_Usage;
  SNS: {
    arn: string;
    region: string;
    accessKeyId: string;
    secretAccessKey: string;
  };
  SQS: {
    url: string;
    region: string;
    accessKeyId: string;
    secretAccessKey: string;
  };
  Redis?: {
    url: string;
  };
}
export declare class AWSBus implements IntegrationEventBus, OnModuleDestroy {
  private readonly subscriptionManager;
  getSubscriptionManager(): IntegrationEventSubscriptionManager;
  publish(event: IntegrationEvent): Promise<void>;
  onModuleDestroy(): Promise<void>;
  constructor(options: AWSIntegrationEventBusOptions, subscriptionManager: IntegrationEventSubscriptionManager);
  private readonly SNSArn;
  private readonly SNSClient;
  private readonly SQSUrl;
  private readonly SQSClient;
  private readonly SQSConsumer?;
  private readonly RedisUrl?;
  private readonly RedisClient?;
  private dispose;
}
//# sourceMappingURL=AWSBus.d.ts.map
