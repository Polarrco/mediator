import { ConstructorType } from "../Helper/ConstructorType";
import { IntegrationEvent } from "./IntegrationEvent";

export const INTEGRATION_EVENTS_HANDLER_METADATA = Symbol("__IntegrationEventHandler__");

export const WatchIntegrationEvent = (eventConstructor: ConstructorType<IntegrationEvent>): ClassDecorator => {
  return (target: Record<string, any>) => {
    Reflect.defineMetadata(INTEGRATION_EVENTS_HANDLER_METADATA, eventConstructor, target);
  };
};
