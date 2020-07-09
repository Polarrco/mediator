import { ConstructorType } from "./ConstructorType";

export function getConstructor<T>(instance: T): ConstructorType<T> | undefined {
  return Object.getPrototypeOf(instance)?.constructor;
}
