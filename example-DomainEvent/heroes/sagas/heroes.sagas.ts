import { Injectable } from "@nestjs/common";
import { Observable } from "rxjs";
import { delay, map } from "rxjs/operators";
import { ICommand, ofType, Saga } from "../../../lib";
import { DropAncientItemCommand } from "../commands/drop-ancient-item.command";
import { HeroKilledDragonEvent } from "../events/hero-killed-dragon.event";

const itemId = "0";

@Injectable()
export class HeroesGameSagas {
  @Saga()
  public dragonKilled = (events$: Observable<any>): Observable<ICommand> => {
    return events$.pipe(
      ofType(HeroKilledDragonEvent),
      delay(1000 * 2),
      map((event) => {
        console.log("Inside [HeroesGameSagas] Saga");
        return new DropAncientItemCommand(event.heroId, itemId);
      })
    );
  };
}
