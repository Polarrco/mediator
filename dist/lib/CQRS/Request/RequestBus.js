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
Object.defineProperty(exports, "__esModule", { value: true });
exports.RequestBus = void 0;
const common_1 = require("@nestjs/common");
const core_1 = require("@nestjs/core");
const CommandHandlerDecorator_1 = require("../Command/CommandHandlerDecorator");
const InvalidQueryHandlerException_1 = require("../Exceptions/InvalidQueryHandlerException");
const QueryNotFoundException_1 = require("../Exceptions/QueryNotFoundException");
const ObservableBus_1 = require("../Helper/ObservableBus");
const QueryHandlerDecorator_1 = require("../Query/QueryHandlerDecorator");
let RequestBus = class RequestBus extends ObservableBus_1.ObservableBus {
    constructor(moduleRef) {
        super();
        this.moduleRef = moduleRef;
        this.handlers = new Map();
    }
    async execute(query) {
        const handler = this.handlers.get(this.getQueryName(query));
        if (!handler) {
            throw new QueryNotFoundException_1.QueryHandlerNotFoundException();
        }
        this.subject$.next(query);
        const result = await handler.execute(query);
        return result;
    }
    bind(handler, name) {
        this.handlers.set(name, handler);
    }
    register(handlers = []) {
        handlers.forEach(handler => this.registerHandler(handler));
    }
    registerHandler(handler) {
        const instance = this.moduleRef.get(handler, { strict: false });
        if (!instance) {
            return;
        }
        const target = this.reflectRequestName(handler);
        if (!target) {
            throw new InvalidQueryHandlerException_1.InvalidQueryHandlerException();
        }
        this.bind(instance, target.name);
    }
    getQueryName(query) {
        const { constructor } = Object.getPrototypeOf(query);
        return constructor.name;
    }
    reflectRequestName(handler) {
        return (Reflect.getMetadata(QueryHandlerDecorator_1.QUERY_HANDLER_METADATA, handler) || Reflect.getMetadata(CommandHandlerDecorator_1.COMMAND_HANDLER_METADATA, handler));
    }
};
RequestBus = __decorate([
    common_1.Injectable(),
    __metadata("design:paramtypes", [core_1.ModuleRef])
], RequestBus);
exports.RequestBus = RequestBus;
//# sourceMappingURL=RequestBus.js.map