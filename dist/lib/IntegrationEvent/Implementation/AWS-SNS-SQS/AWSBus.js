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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AWSBus = void 0;
const common_1 = require("@nestjs/common");
const aws_sdk_1 = __importDefault(require("aws-sdk"));
const IntegrationEventModuleOptions_1 = require("../../IntegrationEventModuleOptions");
const IntegrationEventSubscriptionManager_1 = require("../../IntegrationEventSubscriptionManager");
const SNSHelper_1 = require("./SNSHelper");
const SQSHelper_1 = require("./SQSHelper");
let AWSBus = class AWSBus {
    constructor(options, subscriptionManager) {
        this.subscriptionManager = subscriptionManager;
        let enableConsumer = true;
        if (options.usage === IntegrationEventModuleOptions_1.EventBus_Usage.ProducerOnly) {
            enableConsumer = false;
        }
        aws_sdk_1.default.config.update({
            region: options.SNS.region,
            accessKeyId: options.SNS.accessKeyId,
            secretAccessKey: options.SNS.secretAccessKey,
        });
        this.SNSArn = options.SNS.arn;
        this.SNSClient = new aws_sdk_1.default.SNS();
        aws_sdk_1.default.config.update({
            region: options.SQS.region,
            accessKeyId: options.SQS.accessKeyId,
            secretAccessKey: options.SQS.secretAccessKey,
        });
        this.SQSUrl = options.SQS.url;
        this.SQSClient = new aws_sdk_1.default.SQS();
        if (enableConsumer) {
            this.SQSConsumer = SQSHelper_1.SQSHelper.bundleQueueWithSubscriptions({
                SQSUrl: this.SQSUrl,
                SQSClient: this.SQSClient,
                getSubscriptions: () => this.subscriptionManager.getSubscriptions(),
            });
        }
    }
    getSubscriptionManager() {
        return this.subscriptionManager;
    }
    async publish(event) {
        await SNSHelper_1.SNSHelper.publishEvent({
            event: event,
            SNSArn: this.SNSArn,
            SNSClient: this.SNSClient,
        });
    }
    onModuleDestroy() {
        return this.dispose();
    }
    dispose() {
        return new Promise(resolve => {
            if (this.SQSConsumer) {
                this.SQSConsumer.on("stopped", () => {
                    console.log(`AWS Integration Event Bus Disposed`);
                    resolve();
                });
                this.SQSConsumer.stop();
            }
        });
    }
};
AWSBus = __decorate([
    common_1.Injectable(),
    __param(0, common_1.Inject(IntegrationEventModuleOptions_1.IntegrationEventModuleOptionsIoCAnchor)),
    __metadata("design:paramtypes", [Object, IntegrationEventSubscriptionManager_1.IntegrationEventSubscriptionManager])
], AWSBus);
exports.AWSBus = AWSBus;
//# sourceMappingURL=AWSBus.js.map