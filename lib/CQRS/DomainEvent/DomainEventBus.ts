import { Injectable, Type } from "@nestjs/common";
import { ModuleRef } from "@nestjs/core";
import { Observable } from "rxjs";
import { filter } from "rxjs/operators";
import { CommandBus } from "../Command/CommandBus";
import { InvalidSagaException } from "../Exceptions/InvalidSagaException";
import { ObservableBus } from "../Helper/ObservableBus";
import { ISaga } from "../Saga/ISaga";
import { SAGA_METADATA } from "../Saga/SagaDecorator";
import { DomainEventContainer } from "./DomainEventContainer";
import { DOMAINEVENT_HANDLER_METADATA } from "./DomainEventHandlerDecorator";
import { IDomainEvent } from "./IDomainEvent";
import { IDomainEventBus } from "./IDomainEventBus";
import { IDomainEventHandler } from "./IDomainEventHandler";

export type DomainEventHandlerType = Type<IDomainEventHandler<IDomainEvent>>;

@Injectable()
export class DomainEventBus extends ObservableBus<IDomainEvent> implements IDomainEventBus {
  public publish<T extends IDomainEvent>(event: T) {
    this.subject$.next(event);
  }

  public publishContainer(eventContainer: DomainEventContainer) {
    const events = eventContainer.getDomainEvents();

    (events || []).forEach(event => this.publish(event));

    eventContainer.clearDomainEvents();
  }

  public bind(handler: IDomainEventHandler<IDomainEvent>, name: string) {
    const stream$ = name ? this.ofEventName(name) : this.subject$;
    stream$.subscribe(event => handler.handle(event));
  }

  public registerSagas(types: any[] = []) {
    const sagas = types
      .map(target => {
        const metadata = Reflect.getMetadata(SAGA_METADATA, target) || [];
        const instance = this.moduleRef.get(target, { strict: false });
        if (!instance) {
          throw new InvalidSagaException();
        }
        return metadata.map((key: string) => instance[key]);
      })
      .reduce((a, b) => a.concat(b), []);

    sagas.forEach((saga: ISaga) => this.registerSaga(saga));
  }

  public register(handlers: DomainEventHandlerType[] = []) {
    handlers.forEach(handler => this.registerHandler(handler));
  }

  constructor(private readonly commandBus: CommandBus, private readonly moduleRef: ModuleRef) {
    super();
  }

  protected registerHandler(handler: DomainEventHandlerType) {
    const instance = this.moduleRef.get(handler, { strict: false });
    if (!instance) {
      return;
    }
    const eventsNames = this.reflectEventsNames(handler);
    eventsNames.map(event => this.bind(instance as IDomainEventHandler<IDomainEvent>, event.name));
  }

  protected ofEventName(name: string) {
    return this.subject$.pipe(filter(event => this.getEventName(event) === name));
  }

  protected registerSaga(saga: ISaga) {
    if (typeof saga !== "function" || !(saga instanceof Function)) {
      throw new InvalidSagaException();
    }
    const stream$ = saga(this);
    if (!(stream$ instanceof Observable)) {
      throw new InvalidSagaException();
    }
    stream$.pipe(filter(e => !!e)).subscribe(command => this.commandBus.execute(command));
  }

  private getEventName(event: IDomainEvent): string {
    const { constructor } = Object.getPrototypeOf(event);
    return constructor.name as string;
  }

  private reflectEventsNames(handler: DomainEventHandlerType): FunctionConstructor[] {
    return Reflect.getMetadata(DOMAINEVENT_HANDLER_METADATA, handler);
  }
}
