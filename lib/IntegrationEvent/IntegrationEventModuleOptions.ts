import { AWSIntegrationEventBusOptions } from "./Implementation/AWS-SNS-SQS/AWSBus";
import { AliyunIntegrationEventBusOptions } from "./Implementation/Aliyun-RocketMQ/AliyunBus";

export enum EventBus_Usage {
  ProducerOnly = "ProducerOnly",
  All = "All",
}

interface OptionsForAWS extends AWSIntegrationEventBusOptions {
  type: "AWS-SNS-SQS";
}

interface OptionsForInMemory {
  type: "InMemory";
}

interface OptionsForAliyun extends AliyunIntegrationEventBusOptions {
  type: "Aliyun-RocketMQ";
}

export type IntegrationEventModuleOptions = OptionsForAWS | OptionsForInMemory | OptionsForAliyun;

export const IntegrationEventModuleOptionsIoCAnchor = Symbol("IntegrationEventModuleOptionsIoCAnchor");
