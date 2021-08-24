"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Saga = exports.SAGA_METADATA = void 0;
exports.SAGA_METADATA = Symbol("__saga__");
const Saga = () => {
    return (target, propertyKey) => {
        const properties = Reflect.getMetadata(exports.SAGA_METADATA, target.constructor) || [];
        Reflect.defineMetadata(exports.SAGA_METADATA, [...properties, propertyKey], target.constructor);
    };
};
exports.Saga = Saga;
//# sourceMappingURL=SagaDecorator.js.map