"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
const common_1 = require("@nestjs/common");
const modules_container_1 = require("@nestjs/core/injector/modules-container");
const WatchIntegrationEventDecorator_1 = require("./WatchIntegrationEventDecorator");
let IntegrationEventSubscriptionManager = class IntegrationEventSubscriptionManager {
    constructor(modulesContainer) {
        this.modulesContainer = modulesContainer;
        this.subscriptions = new Map();
    }
    isEmpty() {
        return this.subscriptions.size === 0;
    }
    hasSubscriptionsForEvent(eventConstructor) {
        return this.subscriptions.has(eventConstructor);
    }
    getSubscriptions() {
        return new Map([...this.subscriptions]);
    }
    getSubscriptionsForEvent(eventConstructor) {
        const handlers = this.subscriptions.get(eventConstructor);
        if (handlers) {
            return [...handlers];
        }
        else {
            return [];
        }
    }
    addSubscription(eventConstructor, eventHandler) {
        const handlers = this.subscriptions.get(eventConstructor);
        if (handlers) {
            handlers.push(eventHandler);
        }
        else {
            this.subscriptions.set(eventConstructor, [eventHandler]);
        }
    }
    removeSubscription(eventConstructor, eventHandler) {
        const handlers = this.subscriptions.get(eventConstructor);
        if (handlers) {
            handlers.splice(handlers.findIndex(i => i === eventHandler), 1);
            if (handlers.length === 0) {
                this.subscriptions.delete(eventConstructor);
            }
        }
    }
    removeSubscriptionsForEvent(eventConstructor) {
        this.subscriptions.delete(eventConstructor);
    }
    clear() {
        this.subscriptions.clear();
    }
    onModuleInit() {
        this.exploreStaticSubscriptions();
    }
    exploreStaticSubscriptions() {
        const modules = [...this.modulesContainer.values()];
        for (const { instance } of modules.map(module => [...module.providers.values()]).flat()) {
            const eventHandler = instance;
            if (!eventHandler || !eventHandler.constructor) {
                continue;
            }
            const eventConstructor = Reflect.getMetadata(WatchIntegrationEventDecorator_1.INTEGRATION_EVENTS_HANDLER_METADATA, eventHandler.constructor);
            if (eventConstructor) {
                const handlers = this.subscriptions.get(eventConstructor);
                if (handlers) {
                    handlers.push(eventHandler);
                }
                else {
                    this.subscriptions.set(eventConstructor, [eventHandler]);
                }
            }
        }
    }
};
IntegrationEventSubscriptionManager = __decorate([
    common_1.Injectable(),
    __metadata("design:paramtypes", [modules_container_1.ModulesContainer])
], IntegrationEventSubscriptionManager);
exports.IntegrationEventSubscriptionManager = IntegrationEventSubscriptionManager;
//# sourceMappingURL=IntegrationEventSubscriptionManager.js.map