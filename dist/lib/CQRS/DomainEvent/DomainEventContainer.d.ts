import { IDomainEvent } from "./IDomainEvent";
declare const INTERNAL_EVENTS: unique symbol;
export declare abstract class DomainEventContainer {
  addDomainEvents(events: IDomainEvent | IDomainEvent[]): void;
  clearDomainEvents(): void;
  getDomainEvents(): IDomainEvent[];
  private readonly [INTERNAL_EVENTS];
  private getEventName;
}
export {};
//# sourceMappingURL=DomainEventContainer.d.ts.map
