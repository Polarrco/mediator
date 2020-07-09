import { IQuery } from "./IQuery";

export const QUERY_HANDLER_METADATA = Symbol("__queryHandler__");

export const QueryHandler = (query: IQuery): ClassDecorator => {
  return (target: object) => {
    Reflect.defineMetadata(QUERY_HANDLER_METADATA, query, target);
  };
};
