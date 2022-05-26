import { Inject, Injectable, OnModuleDestroy } from "@nestjs/common";
import { IntegrationEvent } from "../../IntegrationEvent";
import { IntegrationEventBus } from "../../IntegrationEventBus";
import { EventBus_Usage, IntegrationEventModuleOptionsIoCAnchor } from "../../IntegrationEventModuleOptions";
import { IntegrationEventSubscriptionManager } from "../../IntegrationEventSubscriptionManager";
import { RocketMQHelper } from "./RocketMQHelper";
import { getConstructorName } from "../../../Helper/getConstructorName";
import { RedisHelper } from "../../../Helper/RedisHelper";
import { createNodeRedisClient, WrappedNodeRedisClient } from "handy-redis";

export interface AliyunIntegrationEventBusOptions {
  usage: EventBus_Usage;
  rocketMQ: {
    accessKeyId: string;
    accessKeySecret: string;
    endpoint: string;
    instanceId: string;
    topic: string;
    groupId: string;
    batchSize: number;
    pollingDelayInSeconds: number;
  };
  Redis?: {
    url: string;
  };
}

@Injectable()
export class AliyunBus implements IntegrationEventBus, OnModuleDestroy {
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
    await this.RocketMQHelper.publish(event);
  }

  onModuleDestroy(): Promise<void> {
    return this.dispose();
  }

  constructor(
    @Inject(IntegrationEventModuleOptionsIoCAnchor) options: AliyunIntegrationEventBusOptions,
    private readonly subscriptionManager: IntegrationEventSubscriptionManager
  ) {
    this.RedisUrl = options.Redis?.url;
    if (this.RedisUrl) {
      this.RedisClient = createNodeRedisClient(this.RedisUrl);
      this.RedisClient.nodeRedis.on("error", (error) => {
        console.log(error);
      });
    }

    let enableConsumer = true;
    if (options.usage === EventBus_Usage.ProducerOnly) {
      enableConsumer = false;
    }

    this.RocketMQHelper = new RocketMQHelper({
      ...options.rocketMQ,
    });

    if (enableConsumer) {
      this.RocketMQHelper.startConsumer({
        batchSize: options.rocketMQ.batchSize,
        pollingDelayInSeconds: options.rocketMQ.pollingDelayInSeconds,
        subscriptionManager: this.subscriptionManager,
        RedisClient: this.RedisClient,
      }).then(() => {
        console.log("Aliyun RocketMQ consumer started");
      });
    }
  }

  private readonly RedisUrl?: string;
  private readonly RedisClient?: WrappedNodeRedisClient;
  private readonly RocketMQHelper: RocketMQHelper;

  private dispose(): Promise<void> {
    return this.RocketMQHelper.stopConsumer();
  }
}
