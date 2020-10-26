"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DOMAINEVENT_HANDLER_METADATA = Symbol("__DomainEventHandlerMetaData");
exports.DomainEventHandler = (...events) => {
    return (target) => {
        Reflect.defineMetadata(exports.DOMAINEVENT_HANDLER_METADATA, events, target);
    };
};
//# sourceMappingURL=DomainEventHandlerDecorator.js.map