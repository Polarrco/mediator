import { IDomainEvent } from "./IDomainEvent";
export interface IDomainEventHandler<T extends IDomainEvent> {
  handle(event: T): any;
}
//# sourceMappingURL=IDomainEventHandler.d.ts.map
