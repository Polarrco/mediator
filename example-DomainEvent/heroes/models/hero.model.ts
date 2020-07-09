import { DomainEventContainer } from "../../../lib";
import { HeroFoundItemEvent } from "../events/hero-found-item.event";
import { HeroKilledDragonEvent } from "../events/hero-killed-dragon.event";

export class Hero extends DomainEventContainer {
  public killEnemy(enemyId: string) {
    // logic
    this.addDomainEvents(new HeroKilledDragonEvent(this.id, enemyId));
  }

  public addItem(itemId: string) {
    // logic
    this.addDomainEvents(new HeroFoundItemEvent(this.id, itemId));
  }

  constructor(private readonly id: string) {
    super();
  }
}
