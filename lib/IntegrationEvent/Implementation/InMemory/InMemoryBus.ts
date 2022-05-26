import { Injectable, OnModuleDestroy } from "@nestjs/common";
import { IntegrationEvent } from "../../IntegrationEvent";
import { IntegrationEventBus } from "../../IntegrationEventBus";
import { IntegrationEventSubscriptionManager } from "../../IntegrationEventSubscriptionManager";
import { getConstructorName } from "../../../Helper/getConstructorName";
import { handleEvent } from "../../../Helper/handleEvent";
import { undefinedEventName } from "../../../Helper/undefinedEventName";

@Injectable()
export class InMemoryBus implements IntegrationEventBus, OnModuleDestroy {
  getSubscriptionManager(): IntegrationEventSubscriptionManager {
    return this.subscriptionManager;
  }

  async publish(event: IntegrationEvent): Promise<void> {
    const subscription = this.subscriptionManager.getSubscriptionForEvent(
      getConstructorName(event) || undefinedEventName
    );

    if (!subscription) {
      console.log(`There is no subscription for this event: ${getConstructorName(event)}.`);
      return;
    }

    await handleEvent({
      event,
      subscription,
    });
  }

  onModuleDestroy(): void {
    this.dispose();
  }

  constructor(private readonly subscriptionManager: IntegrationEventSubscriptionManager) {}

  private dispose(): void {
    console.log(`In Memory Integration Event Bus Disposed`);
  }
}
