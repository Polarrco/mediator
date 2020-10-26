"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SAGA_METADATA = Symbol("__saga__");
exports.Saga = () => {
    return (target, propertyKey) => {
        const properties = Reflect.getMetadata(exports.SAGA_METADATA, target.constructor) || [];
        Reflect.defineMetadata(exports.SAGA_METADATA, [...properties, propertyKey], target.constructor);
    };
};
//# sourceMappingURL=SagaDecorator.js.map