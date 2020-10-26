import { Type } from "@nestjs/common";
import { Observable } from "rxjs";
import { IDomainEvent } from "../DomainEvent/IDomainEvent";
export declare function ofType<TInput extends IDomainEvent, TOutput extends IDomainEvent>(...types: Array<Type<TOutput>>): (source: Observable<TInput>) => Observable<TOutput>;
//# sourceMappingURL=of-type.d.ts.map