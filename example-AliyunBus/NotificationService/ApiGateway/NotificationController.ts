import { Controller, Get, Inject } from "@nestjs/common";
import { IntegrationEventBus, IntegrationEventBusIoCAnchor } from "../../../lib";
import { IEUserNotified } from "../Service/Application/IntegrationEvent/IE-UserNotified";

@Controller("/")
export class NotificationController {
  @Get()
  public async notify() {
    console.log(`Notify user through Notification controller, dispatching IEUserNotified.`);
    await this.eventBus.publish(
      new IEUserNotified({
        username: "24234234",
        userId: "asdfasdfasfd",
        notifiedDate: new Date(),
      })
    );

    return [];
  }

  constructor(@Inject(IntegrationEventBusIoCAnchor) private readonly eventBus: IntegrationEventBus) {}
}
