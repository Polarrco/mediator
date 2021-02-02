import { Ruid } from "@sevenryze/ruid";

interface IntegrationEventBaseOptions {
  integrationEventId?: string;
  integrationEventCreationDate?: Date;
  queueId?: string;
}

export type IntegrationEventOptions<T extends object = object> = T & IntegrationEventBaseOptions;

export abstract class IntegrationEvent {
  public readonly integrationEventId: string;
  public readonly integrationEventCreationDate: Date;
  public queueId?: string;
  public eventName?: string;

  protected constructor(options: IntegrationEventBaseOptions = {}) {
    this.integrationEventId = options.integrationEventId || new Ruid().toString();
    this.integrationEventCreationDate = options.integrationEventCreationDate || new Date();
    this.queueId = options.queueId;
  }
}
