import { AWSIntegrationEventBusOptions } from "./Implementation/AWS-SNS-SQS/AWSBus";
export declare enum EventBus_Usage {
  ProducerOnly = "ProducerOnly",
  All = "All",
}
interface OptionsForAWS extends AWSIntegrationEventBusOptions {
  type: "AWS-SNS-SQS";
}
interface OptionsForInMemory {
  type: "InMemory";
}
export declare type IntegrationEventModuleOptions = OptionsForAWS | OptionsForInMemory;
export declare const IntegrationEventModuleOptionsIoCAnchor: unique symbol;
export {};
//# sourceMappingURL=IntegrationEventModuleOptions.d.ts.map
