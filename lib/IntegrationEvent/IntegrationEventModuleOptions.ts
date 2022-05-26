import { AWSIntegrationEventBusOptions } from "./Implementation/AWS-SNS-SQS/AWSBus";
import { AliyunIntegrationEventBusOptions } from "./Implementation/Aliyun-RocketMQ/AliyunBus";

export enum EventBus_Type {
  AWS_SNS_SQS = "AWS-SNS-SQS",
  Aliyun_RocketMQ = "Aliyun-RocketMQ",
  InMemory = "InMemory",
}

export enum EventBus_Usage {
  ProducerOnly = "ProducerOnly",
  All = "All",
}

interface OptionsForAWS extends AWSIntegrationEventBusOptions {
  type: EventBus_Type.AWS_SNS_SQS;
}

interface OptionsForInMemory {
  type: EventBus_Type.InMemory;
}

interface OptionsForAliyun extends AliyunIntegrationEventBusOptions {
  type: EventBus_Type.Aliyun_RocketMQ;
}

export type IntegrationEventModuleOptions = OptionsForAWS | OptionsForInMemory | OptionsForAliyun;

export const IntegrationEventModuleOptionsIoCAnchor = Symbol("IntegrationEventModuleOptionsIoCAnchor");
