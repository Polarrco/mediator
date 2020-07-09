import { IRequestHandler } from "../Request/IRequestHandler";

export interface IQueryHandler<T = any, R = any> extends IRequestHandler<T, R> {}
