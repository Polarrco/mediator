import { Observable } from "rxjs";
import { ICommand } from "../Command/ICommand";
import { IDomainEvent } from "../DomainEvent/IDomainEvent";

export type ISaga = (events$: Observable<IDomainEvent>) => Observable<ICommand>;
