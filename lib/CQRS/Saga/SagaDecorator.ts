export const SAGA_METADATA = Symbol("__saga__");

export const Saga = (): PropertyDecorator => {
  return (target: Record<string, any>, propertyKey: string | symbol) => {
    const properties = Reflect.getMetadata(SAGA_METADATA, target.constructor) || [];
    Reflect.defineMetadata(SAGA_METADATA, [...properties, propertyKey], target.constructor);
  };
};
