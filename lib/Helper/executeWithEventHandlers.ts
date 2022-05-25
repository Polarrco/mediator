import { IntegrationEventSubscription } from "../IntegrationEvent/IntegrationEventSubscriptionManager";
import { IntegrationEvent } from "../IntegrationEvent/IntegrationEvent";

export async function executeEventHandlers(
  subscription: IntegrationEventSubscription,
  event: IntegrationEvent
): Promise<void> {
  if (subscription.handlers.length > 0) {
    const results = await Promise.allSettled(subscription.handlers.map((handler) => handler.handle(event)));
    results.forEach((result) => {
      if (result.status !== "fulfilled") {
        console.log(`Handle integration event error: ${result.reason}`);
      }
    });
  }
}
