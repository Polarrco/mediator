"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const rxjs_1 = require("rxjs");
const of_type_1 = require("./of-type");
describe("Operators/ofType", () => {
    class A {
    }
    class B {
    }
    class SubA extends A {
    }
    class C {
    }
    let stream;
    let output;
    let expectedResults;
    beforeEach(() => {
        stream = new rxjs_1.Subject();
        output = [];
        expectedResults = [];
        stream.pipe(of_type_1.ofType(A)).subscribe(event => output.push(event));
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
        expectedResults.forEach((event) => stream.next(event));
        stream.next(new Date());
        expect(output).toEqual(expectedResults);
    });
    it("does not filter instances of classes extending the given types", async () => {
        expectedResults.push(new A(), new SubA());
        stream.next(new B());
        expectedResults.forEach((event) => stream.next(event));
        expect(output).toEqual(expectedResults);
    });
});
//# sourceMappingURL=of-type.spec.js.map