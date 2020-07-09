import { getConstructor } from "./getConstructor";

export function getConstructorName(instance: object): string | undefined {
  return getConstructor(instance)?.name;
}
