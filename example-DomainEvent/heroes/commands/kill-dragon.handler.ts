import { CommandHandler, ICommandHandler } from "../../../lib";
import { HeroRepository } from "../repository/hero.repository";
import { KillDragonCommand } from "./kill-dragon.command";

@CommandHandler(KillDragonCommand)
export class KillDragonHandler implements ICommandHandler<KillDragonCommand, void> {
  public async execute(command: KillDragonCommand) {
    console.log("KillDragonCommand...");

    const { heroId, dragonId } = command;
    const hero = await this.repository.findOneById(+heroId);
    hero.killEnemy(dragonId);

    const result = await this.repository.save(hero);
  }

  constructor(private readonly repository: HeroRepository) {}
}
