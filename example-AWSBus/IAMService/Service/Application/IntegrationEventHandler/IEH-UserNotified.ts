import { IntegrationEventHandler, WatchIntegrationEvent } from "../../../../../lib";
import { IEUserNotified } from "../IntegrationEvent/IE-UserNotified";
import { IdentityRepository } from "../Repository/IdentityRepository";

@WatchIntegrationEvent(IEUserNotified)
export class IEHUserNotified implements IntegrationEventHandler<IEUserNotified> {
  public async handle(event$: IEUserNotified) {
    console.log("Process IEUserNotified in IAM service.");
    this.repo.hello();
  }

  constructor(private readonly repo: IdentityRepository) {}
}
