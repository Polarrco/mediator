export interface ConstructorType<T extends {} = {}> extends Function {
  new (...args: any[]): T;
}
