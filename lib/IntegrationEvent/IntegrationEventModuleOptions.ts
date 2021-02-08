import { AWSIntegrationEventBusOptions } from "./Implementation/AWS-SNS-SQS/AWSBus";

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

export type IntegrationEventModuleOptions = OptionsForAWS | OptionsForInMemory;

export const IntegrationEventModuleOptionsIoCAnchor = Symbol("IntegrationEventModuleOptionsIoCAnchor");
