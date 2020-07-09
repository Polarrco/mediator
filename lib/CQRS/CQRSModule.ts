import { DynamicModule, Inject, Module, OnModuleInit, Optional, Provider, Type } from "@nestjs/common";
import { CommandBus } from "./Command/CommandBus";
import { ICommand } from "./Command/ICommand";
import { ICommandHandler } from "./Command/ICommandHandler";
import { DomainEventBus } from "./DomainEvent/DomainEventBus";
import { IDomainEvent } from "./DomainEvent/IDomainEvent";
import { IDomainEventHandler } from "./DomainEvent/IDomainEventHandler";
import { IQuery } from "./Query/IQuery";
import { IQueryHandler } from "./Query/IQueryHandler";
import { QueryBus } from "./Query/QueryBus";

export interface ICQRSModuleOptions {
  domainEventHandlers?: Array<Type<IDomainEventHandler<IDomainEvent>>>;
  queryHandlers?: Array<Type<IQueryHandler<IQuery, any>>>;
  commandHandlers?: Array<Type<ICommandHandler<ICommand, any>>>;
  sagas?: Array<Type<any>>;
}

export const CQRS_MODULE_OPTIONS = Symbol("CQRS_MODULE_OPTIONS");

@Module({
  exports: [CommandBus, QueryBus, DomainEventBus],
  providers: [CommandBus, QueryBus, DomainEventBus],
})
export class CQRSModule implements OnModuleInit {
  public static RegisterHandlers(options: ICQRSModuleOptions = {}): DynamicModule {
    return {
      module: CQRSModule,
      providers: [CQRSModule.getOptionsProvider(options)],
    };
  }

  public onModuleInit() {
    const { domainEventHandlers, queryHandlers, sagas, commandHandlers } = this.CQRSOptions;

    this.domainEventBus.register(domainEventHandlers);
    this.commandBus.register(commandHandlers);
    this.queryBus.register(queryHandlers);
    this.domainEventBus.registerSagas(sagas);
  }

  constructor(
    @Optional()
    @Inject(CQRS_MODULE_OPTIONS)
    private readonly CQRSOptions: ICQRSModuleOptions = {},
    private readonly domainEventBus: DomainEventBus,
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus
  ) {}

  private static getOptionsProvider(options: ICQRSModuleOptions = {}): Provider {
    const { sagas = [], queryHandlers = [], domainEventHandlers = [], commandHandlers = [] } = options;

    const optionsValue: ICQRSModuleOptions = {
      commandHandlers,
      domainEventHandlers,
      queryHandlers,
      sagas,
    };

    return {
      provide: CQRS_MODULE_OPTIONS,
      useValue: optionsValue,
    };
  }
}
