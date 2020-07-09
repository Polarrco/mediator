import { ModuleRef } from "@nestjs/core";
import { RequestBus } from "../Request/RequestBus";

export class QueryBus extends RequestBus {
  constructor(moduleRef: ModuleRef) {
    super(moduleRef);
  }
}
