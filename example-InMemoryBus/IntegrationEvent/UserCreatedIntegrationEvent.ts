import { IntegrationEvent } from "../../lib";

export class UserCreatedIntegrationEvent extends IntegrationEvent {
  constructor(public readonly userId: string, public readonly username: string) {
    super();
  }
}
