import { WatchIntegrationEvent, IntegrationEventHandler } from "../../lib";
import { UserUpdatedIntegrationEvent } from "../IntegrationEvent/UserUpdatedIntegrationEvent";
import { SMSRepository } from "./SMSRepository";

@WatchIntegrationEvent(UserUpdatedIntegrationEvent)
export class UserUpdatedIntegrationEventHandler implements IntegrationEventHandler<UserUpdatedIntegrationEvent> {
  public async handle(event: UserUpdatedIntegrationEvent) {
    console.log("Process UserUpdatedIntegrationEvent in Notification Service.");
    this.repo.hello();
  }

  constructor(private readonly repo: SMSRepository) {}
}
