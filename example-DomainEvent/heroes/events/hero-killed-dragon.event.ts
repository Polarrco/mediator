import { IDomainEvent } from "../../../lib";

export class HeroKilledDragonEvent implements IDomainEvent {
  constructor(public readonly heroId: string, public readonly dragonId: string) {}
}
