import { Injectable, OnModuleDestroy } from "@nestjs/common";
import { getConstructor } from "../../../Helper/getConstructor";
import { IntegrationEvent } from "../../IntegrationEvent";
import { IntegrationEventBus } from "../../IntegrationEventBus";
import { IntegrationEventSubscriptionManager } from "../../IntegrationEventSubscriptionManager";

@Injectable()
export class InMemoryBus implements IntegrationEventBus, OnModuleDestroy {
  getSubscriptionManager(): IntegrationEventSubscriptionManager {
    return this.subscriptionManager;
  }

  async publish(event: IntegrationEvent): Promise<void> {
    const handlers = this.subscriptionManager.getSubscriptionsForEvent(getConstructor(event)!);
    for (const handler of handlers) {
      await handler.handle(event);
    }
  }

  onModuleDestroy(): void {
    this.dispose();
  }

  constructor(private readonly subscriptionManager: IntegrationEventSubscriptionManager) {}

  private dispose(): void {
    console.log(`In Memory Integration Event Bus Disposed`);
  }
}
