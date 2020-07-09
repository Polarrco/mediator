import { Type } from "@nestjs/common";
import { IDomainEvent } from "./IDomainEvent";

const INTERNAL_EVENTS = Symbol("InternalEventsSlut");

export abstract class DomainEventContainer {
  public addDomainEvents(events: IDomainEvent | IDomainEvent[]) {
    if (!Array.isArray(events)) {
      events = [events];
    }

    for (const event of events as IDomainEvent[]) {
      this[INTERNAL_EVENTS].push(event);
    }
  }

  public clearDomainEvents() {
    this[INTERNAL_EVENTS].length = 0;
  }

  public getDomainEvents() {
    return this[INTERNAL_EVENTS];
  }

  private readonly [INTERNAL_EVENTS]: IDomainEvent[] = [];

  private getEventName(event: Type<IDomainEvent>): string {
    const { constructor } = Object.getPrototypeOf(event);
    return constructor.name as string;
  }
}
