"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ofType = void 0;
const operators_1 = require("rxjs/operators");
function ofType(...types) {
    const isInstanceOf = (event) => !!types.find(classType => event instanceof classType);
    return (source) => source.pipe(operators_1.filter(isInstanceOf));
}
exports.ofType = ofType;
//# sourceMappingURL=of-type.js.map