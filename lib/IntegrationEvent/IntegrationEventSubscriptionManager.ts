import { Injectable, OnModuleInit } from "@nestjs/common";
import { ModulesContainer } from "@nestjs/core/injector/modules-container";
import { ConstructorType } from "../Helper/ConstructorType";
import { IntegrationEvent } from "./IntegrationEvent";
import { IntegrationEventHandler } from "./IntegrationEventHandler";
import { INTEGRATION_EVENTS_HANDLER_METADATA } from "./WatchIntegrationEventDecorator";

export type IntegrationEventSubscriptions = Map<
  ConstructorType<IntegrationEvent>,
  IntegrationEventHandler<IntegrationEvent>[]
>;

@Injectable()
export class IntegrationEventSubscriptionManager implements OnModuleInit {
  isEmpty(): boolean {
    return this.subscriptions.size === 0;
  }

  hasSubscriptionsForEvent(eventConstructor: ConstructorType<IntegrationEvent>): boolean {
    return this.subscriptions.has(eventConstructor);
  }

  getSubscriptions(): IntegrationEventSubscriptions {
    return new Map([...this.subscriptions]);
  }

  getSubscriptionsForEvent<E extends IntegrationEvent>(
    eventConstructor: ConstructorType<E>
  ): IntegrationEventHandler<E>[] {
    const handlers = this.subscriptions.get(eventConstructor);

    if (handlers) {
      return [...handlers];
    } else {
      return [];
    }
  }

  addSubscription<E extends IntegrationEvent, EH extends IntegrationEventHandler<E>>(
    eventConstructor: ConstructorType<E>,
    eventHandler: EH
  ): void {
    const handlers = this.subscriptions.get(eventConstructor);
    if (handlers) {
      handlers.push(eventHandler);
    } else {
      this.subscriptions.set(eventConstructor, [eventHandler]);
    }
  }

  removeSubscription<E extends IntegrationEvent, EH extends IntegrationEventHandler<E>>(
    eventConstructor: ConstructorType<E>,
    eventHandler: EH
  ): void {
    const handlers = this.subscriptions.get(eventConstructor);
    if (handlers) {
      handlers.splice(
        handlers.findIndex(i => i === eventHandler),
        1
      );

      if (handlers.length === 0) {
        this.subscriptions.delete(eventConstructor);
      }
    }
  }

  removeSubscriptionsForEvent<E extends IntegrationEvent>(eventConstructor: ConstructorType<E>): void {
    this.subscriptions.delete(eventConstructor);
  }

  clear(): void {
    this.subscriptions.clear();
  }

  onModuleInit(): void {
    this.exploreStaticSubscriptions();
  }

  // onApplicationBootstrap(): void {
  //   console.log(`SubscriptionManager On Application Bootstrap...`);
  // }
  //
  // onModuleDestroy(): void {
  //   console.log(`SubscriptionManager On Module Destroy...`);
  // }
  //
  // beforeApplicationShutdown(): void {
  //   console.log(`SubscriptionManager Before Application Shutdown...`);
  // }
  //
  // onApplicationShutdown(signal?: string): void {
  //   console.log(`SubscriptionManager On Application Shutdown...`);
  // }

  constructor(private readonly modulesContainer: ModulesContainer) {}

  private subscriptions: IntegrationEventSubscriptions = new Map();

  private exploreStaticSubscriptions(): void {
    const modules = [...this.modulesContainer.values()];

    for (const { instance } of modules.map(module => [...module.providers.values()]).flat()) {
      const eventHandler = instance as IntegrationEventHandler;
      if (!eventHandler || !eventHandler.constructor) {
        continue;
      }

      const eventConstructor = Reflect.getMetadata(INTEGRATION_EVENTS_HANDLER_METADATA, eventHandler.constructor);
      if (eventConstructor) {
        const handlers = this.subscriptions.get(eventConstructor);
        if (handlers) {
          handlers.push(eventHandler);
        } else {
          this.subscriptions.set(eventConstructor, [eventHandler]);
        }
      }
    }
  }
}
