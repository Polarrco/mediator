import { IDomainEvent } from "../../../lib";

export class HeroFoundItemEvent implements IDomainEvent {
  constructor(public readonly heroId: string, public readonly itemId: string) {}
}
