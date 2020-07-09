import { Controller, Get, Inject } from "@nestjs/common";
import { IntegrationEventBus, IntegrationEventBusIoCAnchor } from "../../lib";
import { UserCreatedIntegrationEvent } from "../IntegrationEvent/UserCreatedIntegrationEvent";

@Controller("/notification")
export class NotificationController {
  @Get()
  public async createUser() {
    console.log(`Create user through Notification controller, dispatching UserCreatedIntegrationEvent.`);
    await this.eventBus.publish(new UserCreatedIntegrationEvent("", ""));

    return [];
  }

  constructor(@Inject(IntegrationEventBusIoCAnchor) private readonly eventBus: IntegrationEventBus) {}
}
