import { DynamicModule, OnModuleInit, Type } from "@nestjs/common";
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
export declare const CQRS_MODULE_OPTIONS: unique symbol;
export declare class CQRSModule implements OnModuleInit {
    private readonly CQRSOptions;
    private readonly domainEventBus;
    private readonly commandBus;
    private readonly queryBus;
    static RegisterHandlers(options?: ICQRSModuleOptions): DynamicModule;
    onModuleInit(): void;
    constructor(CQRSOptions: ICQRSModuleOptions, domainEventBus: DomainEventBus, commandBus: CommandBus, queryBus: QueryBus);
    private static getOptionsProvider;
}
//# sourceMappingURL=CQRSModule.d.ts.map