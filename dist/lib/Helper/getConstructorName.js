"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const getConstructor_1 = require("./getConstructor");
function getConstructorName(instance) {
    var _a;
    return (_a = getConstructor_1.getConstructor(instance)) === null || _a === void 0 ? void 0 : _a.name;
}
exports.getConstructorName = getConstructorName;
//# sourceMappingURL=getConstructorName.js.map