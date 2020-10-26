"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.QUERY_HANDLER_METADATA = Symbol("__queryHandler__");
exports.QueryHandler = (query) => {
    return (target) => {
        Reflect.defineMetadata(exports.QUERY_HANDLER_METADATA, query, target);
    };
};
//# sourceMappingURL=QueryHandlerDecorator.js.map