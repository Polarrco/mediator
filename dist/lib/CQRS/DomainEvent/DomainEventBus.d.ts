import { Type } from "@nestjs/common";
import { ModuleRef } from "@nestjs/core";
import { Observable } from "rxjs";
import { CommandBus } from "../Command/CommandBus";
import { ObservableBus } from "../Helper/ObservableBus";
import { ISaga } from "../Saga/ISaga";
import { DomainEventContainer } from "./DomainEventContainer";
import { IDomainEvent } from "./IDomainEvent";
import { IDomainEventBus } from "./IDomainEventBus";
import { IDomainEventHandler } from "./IDomainEventHandler";
export declare type DomainEventHandlerType = Type<IDomainEventHandler<IDomainEvent>>;
export declare class DomainEventBus extends ObservableBus<IDomainEvent> implements IDomainEventBus {
  private readonly commandBus;
  private readonly moduleRef;
  publish<T extends IDomainEvent>(event: T): void;
  publishContainer(eventContainer: DomainEventContainer): void;
  bind(handler: IDomainEventHandler<IDomainEvent>, name: string): void;
  registerSagas(types?: any[]): void;
  register(handlers?: DomainEventHandlerType[]): void;
  constructor(commandBus: CommandBus, moduleRef: ModuleRef);
  protected registerHandler(handler: DomainEventHandlerType): void;
  protected ofEventName(name: string): Observable<IDomainEvent>;
  protected registerSaga(saga: ISaga): void;
  private getEventName;
  private reflectEventsNames;
}
//# sourceMappingURL=DomainEventBus.d.ts.map
