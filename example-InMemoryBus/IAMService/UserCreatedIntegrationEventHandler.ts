import { WatchIntegrationEvent, IntegrationEventHandler } from "../../lib";
import { UserCreatedIntegrationEvent } from "../IntegrationEvent/UserCreatedIntegrationEvent";
import { IdentityRepository } from "./IdentityRepository";

@WatchIntegrationEvent(UserCreatedIntegrationEvent)
export class UserCreatedIntegrationEventHandler implements IntegrationEventHandler<UserCreatedIntegrationEvent> {
  public async handle(event$: UserCreatedIntegrationEvent) {
    console.log("Process UserCreatedIntegrationEvent in IAM service.");
    this.repo.hello();
  }

  constructor(private readonly repo: IdentityRepository) {}
}
