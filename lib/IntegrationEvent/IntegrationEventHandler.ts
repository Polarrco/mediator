import { IntegrationEvent } from "./IntegrationEvent";

export interface IntegrationEventHandler<T extends IntegrationEvent = any> {
  handle(event: T): Promise<any>;
}
