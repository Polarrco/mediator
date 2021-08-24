"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var CQRSModule_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.CQRSModule = exports.CQRS_MODULE_OPTIONS = void 0;
const common_1 = require("@nestjs/common");
const CommandBus_1 = require("./Command/CommandBus");
const DomainEventBus_1 = require("./DomainEvent/DomainEventBus");
const QueryBus_1 = require("./Query/QueryBus");
exports.CQRS_MODULE_OPTIONS = Symbol("CQRS_MODULE_OPTIONS");
let CQRSModule = CQRSModule_1 = class CQRSModule {
    constructor(CQRSOptions = {}, domainEventBus, commandBus, queryBus) {
        this.CQRSOptions = CQRSOptions;
        this.domainEventBus = domainEventBus;
        this.commandBus = commandBus;
        this.queryBus = queryBus;
    }
    static RegisterHandlers(options = {}) {
        return {
            module: CQRSModule_1,
            providers: [CQRSModule_1.getOptionsProvider(options)],
        };
    }
    onModuleInit() {
        const { domainEventHandlers, queryHandlers, sagas, commandHandlers } = this.CQRSOptions;
        this.domainEventBus.register(domainEventHandlers);
        this.commandBus.register(commandHandlers);
        this.queryBus.register(queryHandlers);
        this.domainEventBus.registerSagas(sagas);
    }
    static getOptionsProvider(options = {}) {
        const { sagas = [], queryHandlers = [], domainEventHandlers = [], commandHandlers = [] } = options;
        const optionsValue = {
            commandHandlers,
            domainEventHandlers,
            queryHandlers,
            sagas,
        };
        return {
            provide: exports.CQRS_MODULE_OPTIONS,
            useValue: optionsValue,
        };
    }
};
CQRSModule = CQRSModule_1 = __decorate([
    common_1.Module({
        exports: [CommandBus_1.CommandBus, QueryBus_1.QueryBus, DomainEventBus_1.DomainEventBus],
        providers: [CommandBus_1.CommandBus, QueryBus_1.QueryBus, DomainEventBus_1.DomainEventBus],
    }),
    __param(0, common_1.Optional()),
    __param(0, common_1.Inject(exports.CQRS_MODULE_OPTIONS)),
    __metadata("design:paramtypes", [Object, DomainEventBus_1.DomainEventBus,
        CommandBus_1.CommandBus,
        QueryBus_1.QueryBus])
], CQRSModule);
exports.CQRSModule = CQRSModule;
//# sourceMappingURL=CQRSModule.js.map