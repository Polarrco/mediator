import { Ruid } from "@polarrco/ruid";

interface IntegrationEventBaseOptions {
  integrationEventId?: string;
  integrationEventCreationDate?: Date;
  queueId?: string;
}

export type IntegrationEventOptions<T extends Record<string, any> = Record<string, any>> = T &
  IntegrationEventBaseOptions;

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
