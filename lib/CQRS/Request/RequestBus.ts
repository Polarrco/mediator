import { Injectable, Type } from "@nestjs/common";
import { ModuleRef } from "@nestjs/core";
import { COMMAND_HANDLER_METADATA } from "../Command/CommandHandlerDecorator";
import { InvalidQueryHandlerException } from "../Exceptions/InvalidQueryHandlerException";
import { QueryHandlerNotFoundException } from "../Exceptions/QueryNotFoundException";
import { ObservableBus } from "../Helper/ObservableBus";
import { QUERY_HANDLER_METADATA } from "../Query/QueryHandlerDecorator";
import { IRequest } from "./IRequest";
import { IRequestBus } from "./IRequestBus";
import { IRequestHandler } from "./IRequestHandler";

export type RequestHandlerType = Type<IRequestHandler<IRequest>>;

@Injectable()
export abstract class RequestBus extends ObservableBus<IRequest> implements IRequestBus {
  public async execute<T extends IRequest, TResult>(query: T): Promise<TResult> {
    const handler: IRequestHandler<T, TResult> | undefined = this.handlers.get(this.getQueryName(query));
    if (!handler) {
      throw new QueryHandlerNotFoundException();
    }

    this.subject$.next(query);
    const result = await handler.execute(query);
    return result;
  }

  public bind<T extends IRequest, TResult>(handler: IRequestHandler<T, TResult>, name: string) {
    this.handlers.set(name, handler);
  }

  public register(handlers: RequestHandlerType[] = []) {
    handlers.forEach(handler => this.registerHandler(handler));
  }

  constructor(private readonly moduleRef: ModuleRef) {
    super();
  }

  protected registerHandler(handler: RequestHandlerType) {
    const instance = this.moduleRef.get(handler, { strict: false });
    if (!instance) {
      return;
    }
    const target = this.reflectRequestName(handler);
    if (!target) {
      throw new InvalidQueryHandlerException();
    }
    this.bind(instance as IRequestHandler<IRequest>, target.name);
  }

  private handlers = new Map<string, IRequestHandler<IRequest>>();

  private getQueryName(query: IRequest): string {
    const { constructor } = Object.getPrototypeOf(query);
    return constructor.name as string;
  }

  private reflectRequestName(handler: RequestHandlerType): FunctionConstructor {
    return (
      Reflect.getMetadata(QUERY_HANDLER_METADATA, handler) || Reflect.getMetadata(COMMAND_HANDLER_METADATA, handler)
    );
  }
}
