import { ICommand } from "./ICommand";

export const COMMAND_HANDLER_METADATA = Symbol("__commandHandler__");

export const CommandHandler = (command: ICommand): ClassDecorator => {
  return (target: object) => {
    Reflect.defineMetadata(COMMAND_HANDLER_METADATA, command, target);
  };
};
