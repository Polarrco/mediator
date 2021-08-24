"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.QueryHandler = exports.QUERY_HANDLER_METADATA = void 0;
exports.QUERY_HANDLER_METADATA = Symbol("__queryHandler__");
const QueryHandler = (query) => {
    return (target) => {
        Reflect.defineMetadata(exports.QUERY_HANDLER_METADATA, query, target);
    };
};
exports.QueryHandler = QueryHandler;
//# sourceMappingURL=QueryHandlerDecorator.js.map