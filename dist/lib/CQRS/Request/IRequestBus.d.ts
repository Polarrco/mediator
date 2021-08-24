import { IRequest } from "./IRequest";
export interface IRequestBus {
  execute<T extends IRequest, TRes>(query: T): Promise<TRes>;
}
//# sourceMappingURL=IRequestBus.d.ts.map
