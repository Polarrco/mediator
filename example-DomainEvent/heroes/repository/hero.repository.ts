import { Injectable } from "@nestjs/common";
import { DomainEventBus } from "../../../lib";
import { Hero } from "../models/hero.model";
import { userHero } from "./fixtures/user";

@Injectable()
export class HeroRepository {
  public async findOneById(id: number): Promise<Hero> {
    return userHero;
  }

  public async findAll(): Promise<Hero[]> {
    return [userHero];
  }

  public async save(entity: Hero) {
    const dispatchResult = await this.domainEventBus.publishContainer(entity);

    console.log(`Save hero entity.`);
  }

  constructor(private readonly domainEventBus: DomainEventBus) {}
}
