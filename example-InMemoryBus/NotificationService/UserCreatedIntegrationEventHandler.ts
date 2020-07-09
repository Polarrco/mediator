import { WatchIntegrationEvent, IntegrationEventHandler } from "../../lib";
import { UserCreatedIntegrationEvent } from "../IntegrationEvent/UserCreatedIntegrationEvent";
import { SMSRepository } from "./SMSRepository";

@WatchIntegrationEvent(UserCreatedIntegrationEvent)
export class UserCreatedIntegrationEventHandler implements IntegrationEventHandler<UserCreatedIntegrationEvent> {
  public async handle(event$: UserCreatedIntegrationEvent) {
    console.log("Process UserCreatedIntegrationEvent In Notification Service.");
    this.repo.hello();
  }

  constructor(private readonly repo: SMSRepository) {}
}
