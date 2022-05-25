import { Inject, Injectable, OnModuleDestroy } from "@nestjs/common";
import { IntegrationEvent } from "../../IntegrationEvent";
import { IntegrationEventBus } from "../../IntegrationEventBus";
import { EventBus_Usage, IntegrationEventModuleOptionsIoCAnchor } from "../../IntegrationEventModuleOptions";
import { IntegrationEventSubscriptionManager } from "../../IntegrationEventSubscriptionManager";
import { RocketMQHelper } from "./RocketMQHelper";
import { getConstructorName } from "../../../Helper/getConstructorName";

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
}

@Injectable()
export class AliyunBus implements IntegrationEventBus, OnModuleDestroy {
  getSubscriptionManager(): IntegrationEventSubscriptionManager {
    return this.subscriptionManager;
  }

  async publish(event: IntegrationEvent): Promise<void> {
    event.eventName = getConstructorName(event);
    await this.RocketMQHelper.publish(event);
  }

  onModuleDestroy(): Promise<void> {
    return this.dispose();
  }

  constructor(
    @Inject(IntegrationEventModuleOptionsIoCAnchor) options: AliyunIntegrationEventBusOptions,
    private readonly subscriptionManager: IntegrationEventSubscriptionManager
  ) {
    let enableConsumer = true;
    if (options.usage === EventBus_Usage.ProducerOnly) {
      enableConsumer = false;
    }

    this.RocketMQHelper = new RocketMQHelper({
      ...options.rocketMQ,
      enableConsumer,
      subscriptionManager: this.subscriptionManager,
    });
  }

  private readonly RocketMQHelper: RocketMQHelper;

  private dispose(): Promise<void> {
    return this.RocketMQHelper.stopConsumer();
  }
}
