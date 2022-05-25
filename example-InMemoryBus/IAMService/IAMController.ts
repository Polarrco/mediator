import { Controller, Delete, Get, Inject, Post, Put } from "@nestjs/common";
import { IntegrationEventBus, IntegrationEventBusIoCAnchor, IntegrationEventHandler } from "../../lib";
import { UserCreatedIntegrationEvent } from "../IntegrationEvent/UserCreatedIntegrationEvent";
import { UserUpdatedIntegrationEvent } from "../IntegrationEvent/UserUpdatedIntegrationEvent";

class DynamicIEHUserCreated implements IntegrationEventHandler<UserCreatedIntegrationEvent> {
  async handle(event: UserCreatedIntegrationEvent): Promise<any> {
    console.log(`Dynamic IEH for UserCreated.`);
  }
}

const dynamicHandler = new DynamicIEHUserCreated();

@Controller("/IAM")
export class IAMController {
  @Get()
  public async user(): Promise<any[]> {
    console.log(`Update user through IAM controller, dispatching UserUpdatedIntegrationEvent.`);
    await this.eventBus.publish(new UserUpdatedIntegrationEvent("", ""));

    const subscriptionManager = this.eventBus.getSubscriptionManager();
    console.log("Subscription is empty: " + subscriptionManager.isEmpty());
    console.log(
      `Has subscribed to UserCreatedIntegrationEvent: ${subscriptionManager.hasSubscriptionForEvent(
        UserCreatedIntegrationEvent.name
      )}`
    );
    console.log(
      `The subscription of UserCreatedIntegrationEvent: ${subscriptionManager.getSubscriptionForEvent(
        UserCreatedIntegrationEvent.name
      )}`
    );

    return [];
  }

  @Post()
  public async add(): Promise<any[]> {
    console.log(`Add dynamic subscription.`);

    const subscriptionManager = this.eventBus.getSubscriptionManager();

    subscriptionManager.addSubscription(UserCreatedIntegrationEvent, dynamicHandler);

    return [];
  }

  @Put()
  public async deleteOne(): Promise<any[]> {
    console.log(`Delete dynamic subscription.`);

    const subscriptionManager = this.eventBus.getSubscriptionManager();

    subscriptionManager.removeSubscription(UserCreatedIntegrationEvent, dynamicHandler);

    return [];
  }

  @Delete()
  public async clear(): Promise<any[]> {
    console.log(`Clear subscriptions.`);

    const subscriptionManager = this.eventBus.getSubscriptionManager();

    subscriptionManager.clear();

    return [];
  }

  constructor(@Inject(IntegrationEventBusIoCAnchor) private readonly eventBus: IntegrationEventBus) {}
}
