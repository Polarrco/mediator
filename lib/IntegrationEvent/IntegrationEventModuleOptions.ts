import { AWSIntegrationEventBusOptions } from "./Implementation/AWS-SNS-SQS/AWSBus";

interface OptionsForAWS extends AWSIntegrationEventBusOptions {
  type: "AWS-SNS-SQS";
}

interface OptionsForRabbitMQ {
  type: "RabbitMQ";
}

interface OptionsForRocketMQ {
  type: "RocketMQ";
}

interface OptionsForInMemory {
  type: "InMemory";
}

export type IntegrationEventModuleOptions =
  | OptionsForAWS
  | OptionsForInMemory
  | OptionsForRocketMQ
  | OptionsForRabbitMQ;

export const IntegrationEventModuleOptionsIoCAnchor = Symbol("IntegrationEventModuleOptionsIoCAnchor");
