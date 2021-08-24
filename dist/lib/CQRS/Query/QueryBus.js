"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.QueryBus = void 0;
const RequestBus_1 = require("../Request/RequestBus");
class QueryBus extends RequestBus_1.RequestBus {
    constructor(moduleRef) {
        super(moduleRef);
    }
}
exports.QueryBus = QueryBus;
//# sourceMappingURL=QueryBus.js.map