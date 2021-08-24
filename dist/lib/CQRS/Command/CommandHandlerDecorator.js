"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CommandHandler = exports.COMMAND_HANDLER_METADATA = void 0;
exports.COMMAND_HANDLER_METADATA = Symbol("__commandHandler__");
const CommandHandler = (command) => {
    return (target) => {
        Reflect.defineMetadata(exports.COMMAND_HANDLER_METADATA, command, target);
    };
};
exports.CommandHandler = CommandHandler;
//# sourceMappingURL=CommandHandlerDecorator.js.map