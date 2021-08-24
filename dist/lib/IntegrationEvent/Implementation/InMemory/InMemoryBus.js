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
exports.InMemoryBus = void 0;
const common_1 = require("@nestjs/common");
const getConstructor_1 = require("../../../Helper/getConstructor");
const IntegrationEventSubscriptionManager_1 = require("../../IntegrationEventSubscriptionManager");
let InMemoryBus = class InMemoryBus {
    constructor(subscriptionManager) {
        this.subscriptionManager = subscriptionManager;
    }
    getSubscriptionManager() {
        return this.subscriptionManager;
    }
    async publish(event) {
        const handlers = this.subscriptionManager.getSubscriptionsForEvent(getConstructor_1.getConstructor(event));
        for (const handler of handlers) {
            await handler.handle(event);
        }
    }
    onModuleDestroy() {
        this.dispose();
    }
    dispose() {
        console.log(`In Memory Integration Event Bus Disposed`);
    }
};
InMemoryBus = __decorate([
    common_1.Injectable(),
    __metadata("design:paramtypes", [IntegrationEventSubscriptionManager_1.IntegrationEventSubscriptionManager])
], InMemoryBus);
exports.InMemoryBus = InMemoryBus;
//# sourceMappingURL=InMemoryBus.js.map