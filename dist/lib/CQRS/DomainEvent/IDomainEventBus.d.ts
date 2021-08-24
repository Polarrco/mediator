import { DomainEventContainer } from "./DomainEventContainer";
import { IDomainEvent } from "./IDomainEvent";
export interface IDomainEventBus {
  publish<T extends IDomainEvent>(event: T): any;
  publishContainer(eventContainer: DomainEventContainer): any;
}
//# sourceMappingURL=IDomainEventBus.d.ts.map
