"use strict";
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.DomainEventContainer = void 0;
const INTERNAL_EVENTS = Symbol("InternalEventsSlut");
class DomainEventContainer {
    constructor() {
        this[_a] = [];
    }
    addDomainEvents(events) {
        if (!Array.isArray(events)) {
            events = [events];
        }
        for (const event of events) {
            this[INTERNAL_EVENTS].push(event);
        }
    }
    clearDomainEvents() {
        this[INTERNAL_EVENTS].length = 0;
    }
    getDomainEvents() {
        return this[INTERNAL_EVENTS];
    }
    getEventName(event) {
        const { constructor } = Object.getPrototypeOf(event);
        return constructor.name;
    }
}
exports.DomainEventContainer = DomainEventContainer;
_a = INTERNAL_EVENTS;
//# sourceMappingURL=DomainEventContainer.js.map