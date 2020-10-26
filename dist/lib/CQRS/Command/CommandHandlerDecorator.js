"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.COMMAND_HANDLER_METADATA = Symbol("__commandHandler__");
exports.CommandHandler = (command) => {
    return (target) => {
        Reflect.defineMetadata(exports.COMMAND_HANDLER_METADATA, command, target);
    };
};
//# sourceMappingURL=CommandHandlerDecorator.js.map