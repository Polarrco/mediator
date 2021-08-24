"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var IntegrationEventModule_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.IntegrationEventModule = void 0;
const common_1 = require("@nestjs/common");
const AWSBus_1 = require("./Implementation/AWS-SNS-SQS/AWSBus");
const InMemoryBus_1 = require("./Implementation/InMemory/InMemoryBus");
const IntegrationEventBus_1 = require("./IntegrationEventBus");
const IntegrationEventModuleOptions_1 = require("./IntegrationEventModuleOptions");
const IntegrationEventSubscriptionManager_1 = require("./IntegrationEventSubscriptionManager");
let IntegrationEventModule = IntegrationEventModule_1 = class IntegrationEventModule {
    static forRoot(options) {
        let implementationConstructor;
        switch (options.type) {
            case "AWS-SNS-SQS":
                implementationConstructor = AWSBus_1.AWSBus;
                break;
            case "InMemory":
                implementationConstructor = InMemoryBus_1.InMemoryBus;
                break;
            default:
                throw new Error(`Got invalid integration event bus type.`);
        }
        const integrationEventBusProvider = {
            provide: IntegrationEventBus_1.IntegrationEventBusIoCAnchor,
            useClass: implementationConstructor,
        };
        return {
            module: IntegrationEventModule_1,
            providers: [
                {
                    provide: IntegrationEventModuleOptions_1.IntegrationEventModuleOptionsIoCAnchor,
                    useValue: options,
                },
                integrationEventBusProvider,
            ],
            exports: [integrationEventBusProvider],
        };
    }
};
IntegrationEventModule = IntegrationEventModule_1 = __decorate([
    common_1.Global(),
    common_1.Module({
        providers: [IntegrationEventSubscriptionManager_1.IntegrationEventSubscriptionManager],
    })
], IntegrationEventModule);
exports.IntegrationEventModule = IntegrationEventModule;
//# sourceMappingURL=IntegrationEventModule.js.map