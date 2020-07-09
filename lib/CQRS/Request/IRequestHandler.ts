import { IRequest } from "./IRequest";

export interface IRequestHandler<T extends IRequest, TRes = any> {
  execute(query: T): Promise<TRes>;
}
