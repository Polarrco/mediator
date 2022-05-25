import { IntegrationEventHandler, WatchIntegrationEvent } from "../../../../../lib";
import { IEUserNotified } from "../IntegrationEvent/IE-UserNotified";
import { SMSRepository } from "../Repository/SMSRepository";

@WatchIntegrationEvent(IEUserNotified)
export class IEHUserNotified implements IntegrationEventHandler<IEUserNotified> {
  public async handle(event: IEUserNotified) {
    console.log("Process IEUserNotified in Notification Service.");
    this.repo.hello();
  }

  constructor(private readonly repo: SMSRepository) {}
}
