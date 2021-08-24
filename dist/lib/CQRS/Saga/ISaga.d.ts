import { Observable } from "rxjs";
import { ICommand } from "../Command/ICommand";
import { IDomainEvent } from "../DomainEvent/IDomainEvent";
export declare type ISaga = (events$: Observable<IDomainEvent>) => Observable<ICommand>;
//# sourceMappingURL=ISaga.d.ts.map
