import { Body, Controller, Get, Param, Post } from "@nestjs/common";
import { HeroesGameService } from "./heroes.service";
import { KillDragonDto } from "./interfaces/kill-dragon-dto.interface";
import { Hero } from "./models/hero.model";

@Controller("hero")
export class HeroesGameController {
  @Post(":id/kill")
  public async killDragon(@Param("id") id: string, @Body() dto: KillDragonDto) {
    await this.heroesService.killDragon(id, dto);
  }

  @Get()
  public async findAll(): Promise<Hero[]> {
    return this.heroesService.findAll();
  }

  constructor(private readonly heroesService: HeroesGameService) {}
}
