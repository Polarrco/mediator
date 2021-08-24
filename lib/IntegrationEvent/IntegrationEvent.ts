import { Ruid } from "@polarrco/ruid";

interface IntegrationEventBaseOptions {
  integrationEventId?: string;
  integrationEventCreationDate?: Date;
}

export type IntegrationEventOptions<T extends object = object> = T & IntegrationEventBaseOptions;

export abstract class IntegrationEvent {
  public readonly integrationEventId: string;
  public readonly integrationEventCreationDate: Date;

  protected constructor(options: IntegrationEventBaseOptions = {}) {
    this.integrationEventId = options.integrationEventId || new Ruid().toString();
    this.integrationEventCreationDate = options.integrationEventCreationDate || new Date();
  }
}
