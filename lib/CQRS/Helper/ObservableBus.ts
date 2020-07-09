import { Observable, Subject } from "rxjs";

export class ObservableBus<T> extends Observable<T> {
  constructor() {
    super();
    this.source = this.subject$;
  }

  protected subject$ = new Subject<T>();
}
