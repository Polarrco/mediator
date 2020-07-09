import { IntegrationEvent, IntegrationEventOptions } from "../../../../../lib";

export class IEUserCreated extends IntegrationEvent {
  readonly userId: string;
  readonly username: string;
  readonly createdDate: Date;

  constructor(
    options: IntegrationEventOptions<{
      userId: string;
      username: string;
      createdDate: Date;
    }>
  ) {
    super(options);

    this.userId = options.userId;
    this.username = options.username;
    this.createdDate = options.createdDate;
  }
}
