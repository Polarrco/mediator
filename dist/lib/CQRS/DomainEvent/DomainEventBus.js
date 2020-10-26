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
const common_1 = require("@nestjs/common");
const core_1 = require("@nestjs/core");
const rxjs_1 = require("rxjs");
const operators_1 = require("rxjs/operators");
const CommandBus_1 = require("../Command/CommandBus");
const InvalidSagaException_1 = require("../Exceptions/InvalidSagaException");
const ObservableBus_1 = require("../Helper/ObservableBus");
const SagaDecorator_1 = require("../Saga/SagaDecorator");
const DomainEventHandlerDecorator_1 = require("./DomainEventHandlerDecorator");
let DomainEventBus = class DomainEventBus extends ObservableBus_1.ObservableBus {
    constructor(commandBus, moduleRef) {
        super();
        this.commandBus = commandBus;
        this.moduleRef = moduleRef;
    }
    publish(event) {
        this.subject$.next(event);
    }
    publishContainer(eventContainer) {
        const events = eventContainer.getDomainEvents();
        (events || []).forEach(event => this.publish(event));
        eventContainer.clearDomainEvents();
    }
    bind(handler, name) {
        const stream$ = name ? this.ofEventName(name) : this.subject$;
        stream$.subscribe(event => handler.handle(event));
    }
    registerSagas(types = []) {
        const sagas = types
            .map(target => {
            const metadata = Reflect.getMetadata(SagaDecorator_1.SAGA_METADATA, target) || [];
            const instance = this.moduleRef.get(target, { strict: false });
            if (!instance) {
                throw new InvalidSagaException_1.InvalidSagaException();
            }
            return metadata.map((key) => instance[key]);
        })
            .reduce((a, b) => a.concat(b), []);
        sagas.forEach((saga) => this.registerSaga(saga));
    }
    register(handlers = []) {
        handlers.forEach(handler => this.registerHandler(handler));
    }
    registerHandler(handler) {
        const instance = this.moduleRef.get(handler, { strict: false });
        if (!instance) {
            return;
        }
        const eventsNames = this.reflectEventsNames(handler);
        eventsNames.map(event => this.bind(instance, event.name));
    }
    ofEventName(name) {
        return this.subject$.pipe(operators_1.filter(event => this.getEventName(event) === name));
    }
    registerSaga(saga) {
        if (typeof saga !== "function" || !(saga instanceof Function)) {
            throw new InvalidSagaException_1.InvalidSagaException();
        }
        const stream$ = saga(this);
        if (!(stream$ instanceof rxjs_1.Observable)) {
            throw new InvalidSagaException_1.InvalidSagaException();
        }
        stream$.pipe(operators_1.filter(e => !!e)).subscribe(command => this.commandBus.execute(command));
    }
    getEventName(event) {
        const { constructor } = Object.getPrototypeOf(event);
        return constructor.name;
    }
    reflectEventsNames(handler) {
        return Reflect.getMetadata(DomainEventHandlerDecorator_1.DOMAINEVENT_HANDLER_METADATA, handler);
    }
};
DomainEventBus = __decorate([
    common_1.Injectable(),
    __metadata("design:paramtypes", [CommandBus_1.CommandBus, core_1.ModuleRef])
], DomainEventBus);
exports.DomainEventBus = DomainEventBus;
//# sourceMappingURL=DomainEventBus.js.map