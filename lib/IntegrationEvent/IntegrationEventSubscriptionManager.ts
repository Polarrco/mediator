import { Injectable, OnModuleInit } from "@nestjs/common";
import { ModulesContainer } from "@nestjs/core/injector/modules-container";
import { ConstructorType } from "../Helper/ConstructorType";
import { IntegrationEvent } from "./IntegrationEvent";
import { IntegrationEventHandler } from "./IntegrationEventHandler";
import { INTEGRATION_EVENTS_HANDLER_METADATA } from "./WatchIntegrationEventDecorator";

export interface IntegrationEventSubscription {
  constructor: ConstructorType<IntegrationEvent>;
  handlers: IntegrationEventHandler<IntegrationEvent>[];
}

export type IntegrationEventSubscriptionsMap = Map<
  string,
  IntegrationEventSubscription
>;

@Injectable()
export class IntegrationEventSubscriptionManager implements OnModuleInit {
  isEmpty(): boolean {
    return this.subscriptions.size === 0;
  }

  hasSubscriptionForEvent(eventName: string): boolean {
    return this.subscriptions.has(eventName);
  }

  getSubscriptionForEvent(
    eventName: string
  ): IntegrationEventSubscription | undefined {
    return this.subscriptions.get(eventName);
  }

  addSubscription<E extends IntegrationEvent, EH extends IntegrationEventHandler<E>>(
    eventConstructor: ConstructorType<E>,
    eventHandler: EH
  ): void {
    const subscription = this.subscriptions.get(eventConstructor.name);
    if (subscription) {
      subscription.handlers.push(eventHandler);
    } else {
      this.subscriptions.set(eventConstructor.name, {
        constructor: eventConstructor,
        handlers: [eventHandler],
      });
    }
  }

  removeSubscription<E extends IntegrationEvent, EH extends IntegrationEventHandler<E>>(
    eventConstructor: ConstructorType<E>,
    eventHandler: EH
  ): void {
    const subscription = this.subscriptions.get(eventConstructor.name);
    if (subscription) {
      subscription.handlers.splice(
        subscription.handlers.findIndex((i) => i === eventHandler),
        1
      );

      if (subscription.handlers.length === 0) {
        this.subscriptions.delete(eventConstructor.name);
      }
    }
  }

  removeSubscriptionForEvent(eventName: string): void {
    this.subscriptions.delete(eventName);
  }

  clear(): void {
    this.subscriptions.clear();
  }

  onModuleInit(): void {
    this.loadStaticSubscriptions();
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

  private subscriptions: IntegrationEventSubscriptionsMap = new Map();

  private loadStaticSubscriptions(): void {
    const modules = [...this.modulesContainer.values()];

    for (const { instance } of modules.map((module) => [...module.providers.values()]).flat()) {
      const eventHandler = instance as IntegrationEventHandler;
      if (!eventHandler || !eventHandler.constructor) {
        continue;
      }

      const eventConstructor = Reflect.getMetadata(INTEGRATION_EVENTS_HANDLER_METADATA, eventHandler.constructor);
      if (eventConstructor) {
        this.addSubscription(eventConstructor, eventHandler);
      }
    }
  }
}
