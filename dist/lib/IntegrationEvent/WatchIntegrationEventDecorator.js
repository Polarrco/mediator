"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.INTEGRATION_EVENTS_HANDLER_METADATA = Symbol("__IntegrationEventHandler__");
exports.WatchIntegrationEvent = (eventConstructor) => {
    return (target) => {
        Reflect.defineMetadata(exports.INTEGRATION_EVENTS_HANDLER_METADATA, eventConstructor, target);
    };
};
//# sourceMappingURL=WatchIntegrationEventDecorator.js.map