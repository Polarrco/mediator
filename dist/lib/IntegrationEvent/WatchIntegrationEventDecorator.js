"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WatchIntegrationEvent = exports.INTEGRATION_EVENTS_HANDLER_METADATA = void 0;
exports.INTEGRATION_EVENTS_HANDLER_METADATA = Symbol("__IntegrationEventHandler__");
const WatchIntegrationEvent = (eventConstructor) => {
    return (target) => {
        Reflect.defineMetadata(exports.INTEGRATION_EVENTS_HANDLER_METADATA, eventConstructor, target);
    };
};
exports.WatchIntegrationEvent = WatchIntegrationEvent;
//# sourceMappingURL=WatchIntegrationEventDecorator.js.map