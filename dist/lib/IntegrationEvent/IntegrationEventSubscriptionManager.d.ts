import { OnModuleInit } from "@nestjs/common";
import { ModulesContainer } from "@nestjs/core/injector/modules-container";
import { ConstructorType } from "../Helper/ConstructorType";
import { IntegrationEvent } from "./IntegrationEvent";
import { IntegrationEventHandler } from "./IntegrationEventHandler";
export declare type IntegrationEventSubscriptions = Map<
  ConstructorType<IntegrationEvent>,
  IntegrationEventHandler<IntegrationEvent>[]
>;
export declare class IntegrationEventSubscriptionManager implements OnModuleInit {
  private readonly modulesContainer;
  isEmpty(): boolean;
  hasSubscriptionsForEvent(eventConstructor: ConstructorType<IntegrationEvent>): boolean;
  getSubscriptions(): IntegrationEventSubscriptions;
  getSubscriptionsForEvent<E extends IntegrationEvent>(
    eventConstructor: ConstructorType<E>
  ): IntegrationEventHandler<E>[];
  addSubscription<E extends IntegrationEvent, EH extends IntegrationEventHandler<E>>(
    eventConstructor: ConstructorType<E>,
    eventHandler: EH
  ): void;
  removeSubscription<E extends IntegrationEvent, EH extends IntegrationEventHandler<E>>(
    eventConstructor: ConstructorType<E>,
    eventHandler: EH
  ): void;
  removeSubscriptionsForEvent<E extends IntegrationEvent>(eventConstructor: ConstructorType<E>): void;
  clear(): void;
  onModuleInit(): void;
  constructor(modulesContainer: ModulesContainer);
  private subscriptions;
  private exploreStaticSubscriptions;
}
//# sourceMappingURL=IntegrationEventSubscriptionManager.d.ts.map
