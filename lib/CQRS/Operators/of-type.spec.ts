import { Subject } from "rxjs";
import { IDomainEvent } from "../DomainEvent/IDomainEvent";
import { ofType } from "./of-type";

describe("Operators/ofType", () => {
  class A implements IDomainEvent {}
  class B implements IDomainEvent {}
  class SubA extends A {}
  class C implements IDomainEvent {}

  let stream: Subject<any>;
  let output: IDomainEvent[];
  let expectedResults: IDomainEvent[];

  beforeEach(() => {
    stream = new Subject();
    output = [];
    expectedResults = [];

    stream.pipe(ofType(A)).subscribe(event => output.push(event));
  });

  it("filters all the domainEventHandlers when none is an instance of the given types", async () => {
    stream.next(new B());
    stream.next(new C());
    stream.next(new B());

    expect(output).toEqual([]);
  });

  it("filters instances of domainEventHandlers to keep those of the given types", async () => {
    expectedResults.push(new A());

    stream.next(new B());
    stream.next(...expectedResults);
    stream.next(new Date());

    expect(output).toEqual(expectedResults);
  });

  it("does not filter instances of classes extending the given types", async () => {
    expectedResults.push(new A(), new SubA());

    stream.next(new B());
    expectedResults.forEach(event => stream.next(event));

    expect(output).toEqual(expectedResults);
  });
});
