interface IntegrationEventBaseOptions {
  integrationEventId?: string;
  integrationEventCreationDate?: Date;
  queueId?: string;
}
export declare type IntegrationEventOptions<T extends object = object> = T & IntegrationEventBaseOptions;
export declare abstract class IntegrationEvent {
  readonly integrationEventId: string;
  readonly integrationEventCreationDate: Date;
  queueId?: string;
  eventName?: string;
  protected constructor(options?: IntegrationEventBaseOptions);
}
export {};
//# sourceMappingURL=IntegrationEvent.d.ts.map
