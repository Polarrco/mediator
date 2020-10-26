import { OnModuleDestroy } from "@nestjs/common";
import { IntegrationEvent } from "../../IntegrationEvent";
import { IntegrationEventBus } from "../../IntegrationEventBus";
import { IntegrationEventSubscriptionManager } from "../../IntegrationEventSubscriptionManager";
export declare class InMemoryBus implements IntegrationEventBus, OnModuleDestroy {
    private readonly subscriptionManager;
    getSubscriptionManager(): IntegrationEventSubscriptionManager;
    publish(event: IntegrationEvent): Promise<void>;
    onModuleDestroy(): void;
    constructor(subscriptionManager: IntegrationEventSubscriptionManager);
    private dispose;
}
//# sourceMappingURL=InMemoryBus.d.ts.map