"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.IntegrationEvent = void 0;
const ruid_1 = require("@polarrco/ruid");
class IntegrationEvent {
    constructor(options = {}) {
        this.integrationEventId = options.integrationEventId || new ruid_1.Ruid().toString();
        this.integrationEventCreationDate = options.integrationEventCreationDate || new Date();
    }
}
exports.IntegrationEvent = IntegrationEvent;
//# sourceMappingURL=IntegrationEvent.js.map