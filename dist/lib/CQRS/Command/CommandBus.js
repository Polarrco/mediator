"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const RequestBus_1 = require("../Request/RequestBus");
class CommandBus extends RequestBus_1.RequestBus {
    constructor(moduleRef) {
        super(moduleRef);
    }
}
exports.CommandBus = CommandBus;
//# sourceMappingURL=CommandBus.js.map