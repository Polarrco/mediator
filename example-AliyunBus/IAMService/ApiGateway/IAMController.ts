import { Controller, Get, Inject } from "@nestjs/common";
import { IntegrationEventBus, IntegrationEventBusIoCAnchor } from "../../../lib";
import { IEUserCreated } from "../Service/Application/IntegrationEvent/IE-UserCreated";

@Controller("/")
export class IAMController {
  @Get()
  public async create(): Promise<any[]> {
    console.log(`Create user through IAM controller, dispatching IEUserCreated.`);
    await this.eventBus.publish(
      new IEUserCreated({
        userId: "123",
        username: "234",
        createdDate: new Date(),
      })
    );

    return [];
  }

  constructor(@Inject(IntegrationEventBusIoCAnchor) private readonly eventBus: IntegrationEventBus) {}
}
