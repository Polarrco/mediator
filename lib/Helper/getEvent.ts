import { IntegrationEventSubscription } from "../IntegrationEvent/IntegrationEventSubscriptionManager";
import { IntegrationEvent } from "../IntegrationEvent/IntegrationEvent";

export function getEvent(subscription: IntegrationEventSubscription, eventData: any): IntegrationEvent {
  return new subscription.constructor(eventData);
}
