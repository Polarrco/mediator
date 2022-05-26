import { DynamicModule, Global, Module, Provider } from "@nestjs/common";
import { ConstructorType } from "../Helper/ConstructorType";
import { AWSBus } from "./Implementation/AWS-SNS-SQS/AWSBus";
import { InMemoryBus } from "./Implementation/InMemory/InMemoryBus";
import { IntegrationEventBus, IntegrationEventBusIoCAnchor } from "./IntegrationEventBus";
import {
  EventBus_Type,
  IntegrationEventModuleOptions,
  IntegrationEventModuleOptionsIoCAnchor,
} from "./IntegrationEventModuleOptions";
import { IntegrationEventSubscriptionManager } from "./IntegrationEventSubscriptionManager";
import { AliyunBus } from "./Implementation/Aliyun-RocketMQ/AliyunBus";

/**
 * Note that the properties returned by the dynamic module extend (rather than override) the base module metadata defined in the @Module() decorator.
 *
 * https://docs.nestjs.com/modules#dynamic-modules
 */

@Global()
@Module({
  providers: [IntegrationEventSubscriptionManager],
})
export class IntegrationEventModule {
  static forRoot(options: IntegrationEventModuleOptions): DynamicModule {
    let implementationConstructor: ConstructorType<IntegrationEventBus>;
    console.log(options.type);
    switch (options.type) {
      case EventBus_Type.AWS_SNS_SQS:
        console.log(1);
        implementationConstructor = AWSBus;
        break;
      case EventBus_Type.InMemory:
        console.log(2);
        implementationConstructor = InMemoryBus;
        break;
      case EventBus_Type.Aliyun_RocketMQ:
        console.log(3);
        implementationConstructor = AliyunBus;
        break;
      default:
        throw new Error(`Got invalid integration event bus type.`);
    }

    const integrationEventBusProvider: Provider = {
      provide: IntegrationEventBusIoCAnchor,
      useClass: implementationConstructor,
    };

    return {
      module: IntegrationEventModule,
      providers: [
        {
          provide: IntegrationEventModuleOptionsIoCAnchor,
          useValue: options,
        },
        integrationEventBusProvider,
      ],
      exports: [integrationEventBusProvider],
    };
  }

  // onModuleInit(): void {
  //   console.log(`Integration Event Module On Module Init...`);
  // }
  //
  // onApplicationBootstrap(): void {
  //   console.log(`Integration Event Module On Application Bootstrap...`);
  // }
  //
  // onModuleDestroy(): void {
  //   console.log(`Integration Event Module On Module Destroy...`);
  // }
  //
  // beforeApplicationShutdown(): void {
  //   console.log(`Integration Event Module Before Application Shutdown...`);
  // }
  //
  // onApplicationShutdown(signal?: string): void {
  //   console.log(`Integration Event Module On Application Shutdown...`);
  // }
}
