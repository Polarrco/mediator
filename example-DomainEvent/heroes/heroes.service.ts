import { Injectable } from "@nestjs/common";
import { CommandBus, QueryBus } from "../../lib";
import { KillDragonCommand } from "./commands/kill-dragon.command";
import { KillDragonDto } from "./interfaces/kill-dragon-dto.interface";
import { Hero } from "./models/hero.model";
import { GetHeroesQuery } from "./queries/get-heroes.query";

@Injectable()
export class HeroesGameService {
  public async killDragon(heroId: string, killDragonDto: KillDragonDto) {
    return this.commandBus.execute(new KillDragonCommand(heroId, killDragonDto.dragonId));
  }

  public async findAll(): Promise<Hero[]> {
    return this.queryBus.execute(new GetHeroesQuery());
  }

  constructor(private readonly commandBus: CommandBus, private readonly queryBus: QueryBus) {}
}
