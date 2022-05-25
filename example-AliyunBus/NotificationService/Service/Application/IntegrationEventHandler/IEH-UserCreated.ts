import { IntegrationEventHandler, WatchIntegrationEvent } from "../../../../../lib";
import { IEUserCreated } from "../IntegrationEvent/IE-UserCreated";
import { SMSRepository } from "../Repository/SMSRepository";

@WatchIntegrationEvent(IEUserCreated)
export class IEHUserCreated implements IntegrationEventHandler<IEUserCreated> {
  public async handle(event$: IEUserCreated) {
    console.log("Process IEUserCreated In Notification Service.");
    this.repo.hello();

    // throw new Error(`Hahahahha`);
  }

  constructor(private readonly repo: SMSRepository) {}
}
