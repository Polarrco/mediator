import { Inject, Injectable, OnModuleDestroy } from "@nestjs/common";
import { Consumer } from "sqs-consumer";
import { createNodeRedisClient, WrappedNodeRedisClient } from "handy-redis";
import { IntegrationEvent } from "../../IntegrationEvent";
import { IntegrationEventBus } from "../../IntegrationEventBus";
import { EventBus_Usage, IntegrationEventModuleOptionsIoCAnchor } from "../../IntegrationEventModuleOptions";
import { IntegrationEventSubscriptionManager } from "../../IntegrationEventSubscriptionManager";
import { SNSHelper } from "./SNSHelper";
import { SQSHelper } from "./SQSHelper";
import { RedisHelper } from "../../../Helper/RedisHelper";
import { Connection } from "mongoose";
import { getConstructorName } from "../../../Helper/getConstructorName";
import { SNSClient } from "@aws-sdk/client-sns";
import { SQSClient } from "@aws-sdk/client-sqs";

export interface AWSIntegrationEventBusOptions {
  usage: EventBus_Usage;
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
    batchSize?: number;
  };
  Redis?: {
    url: string;
  };
  MongoDB?: {
    connection: Connection;
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
    event.eventName = getConstructorName(event);
    if (this.RedisClient) {
      await RedisHelper.storeEventData({
        event: event,
        RedisClient: this.RedisClient,
      });
    }
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
    this.RedisUrl = options.Redis?.url;
    if (this.RedisUrl) {
      this.RedisClient = createNodeRedisClient(this.RedisUrl);
      this.RedisClient.nodeRedis.on("error", (error) => {
        console.log(error);
      });
    }

    if (!this.RedisClient) {
      this.MongoDBConnection = options.MongoDB?.connection;
    }

    let enableConsumer = true;
    if (options.usage === EventBus_Usage.ProducerOnly) {
      enableConsumer = false;
    }

    this.SNSArn = options.SNS.arn;
    this.SNSClient = new SNSClient({
      region: options.SNS.region,
      credentials: {
        accessKeyId: options.SNS.accessKeyId,
        secretAccessKey: options.SNS.secretAccessKey,
      },
    });

    this.SQSUrl = options.SQS.url;
    this.SQSClient = new SQSClient({
      region: options.SQS.region,
      credentials: {
        accessKeyId: options.SQS.accessKeyId,
        secretAccessKey: options.SQS.secretAccessKey,
      },
    });

    if (enableConsumer) {
      this.SQSConsumer = SQSHelper.bundleQueueWithSubscriptions({
        SQSUrl: this.SQSUrl,
        SQSClient: this.SQSClient,
        subscriptionManager: this.subscriptionManager,
        RedisClient: this.RedisClient,
        MongoDBConnection: this.MongoDBConnection,
        batchSize: options.SQS.batchSize,
      });
    }
  }

  private readonly SNSArn: string;
  private readonly SNSClient: SNSClient;

  private readonly SQSUrl: string;
  private readonly SQSClient: SQSClient;
  private readonly SQSConsumer?: Consumer;

  private readonly RedisUrl?: string;
  private readonly RedisClient?: WrappedNodeRedisClient;
  private readonly MongoDBConnection?: Connection;

  private dispose(): Promise<void> {
    return new Promise<void>((resolve) => {
      if (this.SQSConsumer) {
        this.SQSConsumer.on("stopped", () => {
          console.log(`AWS Integration Event Bus Disposed`);
          resolve();
        });

        this.SQSConsumer.stop();
      }
    });
  }
}
