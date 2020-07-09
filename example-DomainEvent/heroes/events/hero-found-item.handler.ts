import { DomainEventHandler, IDomainEventHandler } from "../../../lib";
import { HeroRepository } from "../repository/hero.repository";
import { HeroFoundItemEvent } from "./hero-found-item.event";

@DomainEventHandler(HeroFoundItemEvent)
export class HeroFoundItemHandler implements IDomainEventHandler<HeroFoundItemEvent> {
  public async handle(event: HeroFoundItemEvent) {
    console.log("Async HeroFoundItemEvent...");
  }

  constructor(private readonly repository: HeroRepository) {}
}
