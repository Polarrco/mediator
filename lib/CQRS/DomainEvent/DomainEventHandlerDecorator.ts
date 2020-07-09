import { IDomainEvent } from "./IDomainEvent";

export const DOMAINEVENT_HANDLER_METADATA = Symbol("__DomainEventHandlerMetaData");

export const DomainEventHandler = (...events: IDomainEvent[]): ClassDecorator => {
  return (target: object) => {
    Reflect.defineMetadata(DOMAINEVENT_HANDLER_METADATA, events, target);
  };
};
