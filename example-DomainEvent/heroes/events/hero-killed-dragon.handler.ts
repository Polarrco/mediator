import { DomainEventHandler, IDomainEventHandler } from "../../../lib";
import { HeroRepository } from "../repository/hero.repository";
import { HeroKilledDragonEvent } from "./hero-killed-dragon.event";

@DomainEventHandler(HeroKilledDragonEvent)
export class HeroKilledDragonHandler implements IDomainEventHandler<HeroKilledDragonEvent> {
  public handle(event: HeroKilledDragonEvent) {
    console.log("HeroKilledDragonEvent...");
  }

  constructor(private readonly repository: HeroRepository) {}
}
