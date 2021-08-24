"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DomainEventHandler = exports.DOMAINEVENT_HANDLER_METADATA = void 0;
exports.DOMAINEVENT_HANDLER_METADATA = Symbol("__DomainEventHandlerMetaData");
const DomainEventHandler = (...events) => {
    return (target) => {
        Reflect.defineMetadata(exports.DOMAINEVENT_HANDLER_METADATA, events, target);
    };
};
exports.DomainEventHandler = DomainEventHandler;
//# sourceMappingURL=DomainEventHandlerDecorator.js.map