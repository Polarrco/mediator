import { Injectable, OnModuleDestroy } from "@nestjs/common";
import { getConstructor } from "../../../Helper/getConstructor";
import { IntegrationEvent } from "../../IntegrationEvent";
import { IntegrationEventBus } from "../../IntegrationEventBus";
import { IntegrationEventSubscriptionManager } from "../../IntegrationEventSubscriptionManager";
import { getConstructorName } from "../../../Helper/getConstructorName";

@Injectable()
export class InMemoryBus implements IntegrationEventBus, OnModuleDestroy {
  getSubscriptionManager(): IntegrationEventSubscriptionManager {
    return this.subscriptionManager;
  }

  async publish(event: IntegrationEvent): Promise<void> {
    const subscription = this.subscriptionManager.getSubscriptionForEvent(getConstructorName(event)!);
    if (subscription) {
      for (const handler of subscription.handlers) {
        await handler.handle(event);
      }
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
