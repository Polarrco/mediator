import { IntegrationEvent } from "./IntegrationEvent";
import { IntegrationEventSubscriptionManager } from "./IntegrationEventSubscriptionManager";
export interface IntegrationEventBus {
    publish(event: IntegrationEvent): Promise<void>;
    getSubscriptionManager(): Omit<IntegrationEventSubscriptionManager, "onModuleInit">;
}
export declare const IntegrationEventBusIoCAnchor: unique symbol;
//# sourceMappingURL=IntegrationEventBus.d.ts.map