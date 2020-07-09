import { Module } from "@nestjs/common";
import { CQRSModule } from "../../lib";
import { DropAncientItemHandler } from "./commands/drop-ancient-item.handler";
import { KillDragonHandler } from "./commands/kill-dragon.handler";
import { HeroFoundItemHandler } from "./events/hero-found-item.handler";
import { HeroKilledDragonHandler } from "./events/hero-killed-dragon.handler";
import { HeroesGameController } from "./heroes.controller";
import { HeroesGameService } from "./heroes.service";
import { GetHeroesHandler } from "./queries/get-heroes.handler";
import { HeroRepository } from "./repository/hero.repository";
import { HeroesGameSagas } from "./sagas/heroes.sagas";

export const CommandHandlers = [KillDragonHandler, DropAncientItemHandler];
export const QueryHandlers = [GetHeroesHandler];
export const EventHandlers = [HeroKilledDragonHandler, HeroFoundItemHandler];
export const Sagas = [HeroesGameSagas];

@Module({
  controllers: [HeroesGameController],
  imports: [
    CQRSModule.RegisterHandlers({
      commandHandlers: CommandHandlers,
      domainEventHandlers: EventHandlers,
      queryHandlers: QueryHandlers,
      sagas: Sagas,
    }),
  ],
  providers: [
    HeroesGameService,
    HeroRepository,
    ...CommandHandlers,
    ...EventHandlers,
    ...QueryHandlers,
    HeroesGameSagas,
  ],
})
export class HeroesGameModule {}
