"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ruid_1 = require("@sevenryze/ruid");
class IntegrationEvent {
    constructor(options = {}) {
        this.integrationEventId = options.integrationEventId || new ruid_1.Ruid().toString();
        this.integrationEventCreationDate = options.integrationEventCreationDate || new Date();
    }
}
exports.IntegrationEvent = IntegrationEvent;
//# sourceMappingURL=IntegrationEvent.js.map