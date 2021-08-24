import { Type } from "@nestjs/common";
import { ModuleRef } from "@nestjs/core";
import { ObservableBus } from "../Helper/ObservableBus";
import { IRequest } from "./IRequest";
import { IRequestBus } from "./IRequestBus";
import { IRequestHandler } from "./IRequestHandler";
export declare type RequestHandlerType = Type<IRequestHandler<IRequest>>;
export declare abstract class RequestBus extends ObservableBus<IRequest> implements IRequestBus {
  private readonly moduleRef;
  execute<T extends IRequest, TResult>(query: T): Promise<TResult>;
  bind<T extends IRequest, TResult>(handler: IRequestHandler<T, TResult>, name: string): void;
  register(handlers?: RequestHandlerType[]): void;
  constructor(moduleRef: ModuleRef);
  protected registerHandler(handler: RequestHandlerType): void;
  private handlers;
  private getQueryName;
  private reflectRequestName;
}
//# sourceMappingURL=RequestBus.d.ts.map
