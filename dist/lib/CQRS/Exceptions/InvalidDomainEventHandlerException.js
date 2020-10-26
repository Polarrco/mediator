"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class InvalidDomainEventHandlerException extends Error {
    constructor() {
        super(`Invalid event handler exception (missing @DomainEventHandler() decorator?)`);
    }
}
exports.InvalidDomainEventHandlerException = InvalidDomainEventHandlerException;
//# sourceMappingURL=InvalidDomainEventHandlerException.js.map