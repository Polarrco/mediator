import { IntegrationEvent, IntegrationEventOptions } from "../../../../../lib";

export class IEUserNotified extends IntegrationEvent {
  readonly userId: string;
  readonly username: string;
  readonly notifiedDate: Date;

  constructor(
    options: IntegrationEventOptions<{
      userId: string;
      username: string;
      notifiedDate: Date;
    }>
  ) {
    super(options);

    this.userId = options.userId;
    this.username = options.username;
    this.notifiedDate = options.notifiedDate;
  }
}
