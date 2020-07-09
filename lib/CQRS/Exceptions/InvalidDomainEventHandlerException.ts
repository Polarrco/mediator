export class InvalidDomainEventHandlerException extends Error {
  constructor() {
    super(`Invalid event handler exception (missing @DomainEventHandler() decorator?)`);
  }
}
