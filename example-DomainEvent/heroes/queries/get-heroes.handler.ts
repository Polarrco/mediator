import { IQueryHandler, QueryHandler } from "../../../lib";
import { Hero } from "../models/hero.model";
import { HeroRepository } from "../repository/hero.repository";
import { GetHeroesQuery } from "./get-heroes.query";

@QueryHandler(GetHeroesQuery)
export class GetHeroesHandler implements IQueryHandler<GetHeroesQuery, Hero[]> {
  public async execute(query: GetHeroesQuery) {
    console.log("Async GetHeroesQuery...");
    return this.repository.findAll();
  }

  constructor(private readonly repository: HeroRepository) {}
}
