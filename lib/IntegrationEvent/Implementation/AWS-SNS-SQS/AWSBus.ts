import { Inject, Injectable, OnModuleDestroy } from "@nestjs/common";
import AWS, { SNS, SQS } from "aws-sdk";
import { Consumer } from "sqs-consumer";
import { IntegrationEvent } from "../../IntegrationEvent";
import { IntegrationEventBus } from "../../IntegrationEventBus";
import { IntegrationEventModuleOptionsIoCAnchor } from "../../IntegrationEventModuleOptions";
import { IntegrationEventSubscriptionManager } from "../../IntegrationEventSubscriptionManager";
import { SNSHelper } from "./SNSHelper";
import { SQSHelper } from "./SQSHelper";

export interface AWSIntegrationEventBusOptions {
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
}

/**
 * Use `event-name` as the attribute to filter subscription from SNQ -> SQS.
 */
@Injectable()
export class AWSBus implements IntegrationEventBus, OnModuleDestroy {
  getSubscriptionManager(): IntegrationEventSubscriptionManager {
    return this.subscriptionManager;
  }

  async publish(event: IntegrationEvent): Promise<void> {
    await SNSHelper.publishEvent({
      event: event,
      SNSArn: this.SNSArn,
      SNSClient: this.SNSClient,
    });
  }

  onModuleDestroy(): Promise<void> {
    return this.dispose();
  }

  constructor(
    @Inject(IntegrationEventModuleOptionsIoCAnchor) options: AWSIntegrationEventBusOptions,
    private readonly subscriptionManager: IntegrationEventSubscriptionManager
  ) {
    AWS.config.update({
      region: options.SNS.region,
      accessKeyId: options.SNS.accessKeyId,
      secretAccessKey: options.SNS.secretAccessKey,
    });
    this.SNSArn = options.SNS.arn;
    this.SNSClient = new AWS.SNS();

    AWS.config.update({
      region: options.SQS.region,
      accessKeyId: options.SQS.accessKeyId,
      secretAccessKey: options.SQS.secretAccessKey,
    });
    this.SQSUrl = options.SQS.url;
    this.SQSClient = new AWS.SQS();

    this.SQSConsumer = SQSHelper.bundleQueueWithSubscriptions({
      SQSUrl: this.SQSUrl,
      SQSClient: this.SQSClient,
      getSubscriptions: () => this.subscriptionManager.getSubscriptions(),
    });
  }

  private readonly SNSArn: string;
  private readonly SNSClient: SNS;

  private readonly SQSUrl: string;
  private readonly SQSClient: SQS;
  private readonly SQSConsumer: Consumer;

  private dispose(): Promise<void> {
    return new Promise<void>(resolve => {
      this.SQSConsumer.on("stopped", () => {
        console.log(`AWS Integration Event Bus Disposed`);
        resolve();
      });

      this.SQSConsumer.stop();
    });
  }
}
