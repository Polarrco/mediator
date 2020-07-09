import { IntegrationEvent } from "../../lib";

export class UserUpdatedIntegrationEvent extends IntegrationEvent {
  constructor(public readonly userId: string, public readonly username: string) {
    super();
  }
}
