import { CommandHandler, ICommandHandler } from "../../../lib";
import { HeroRepository } from "../repository/hero.repository";
import { DropAncientItemCommand } from "./drop-ancient-item.command";

@CommandHandler(DropAncientItemCommand)
export class DropAncientItemHandler implements ICommandHandler<DropAncientItemCommand, void> {
  public async execute(command: DropAncientItemCommand) {
    console.log("Async DropAncientItemCommand...");

    const { heroId, itemId } = command;
    const hero = await this.repository.findOneById(+heroId);
    hero.addItem(itemId);

    const result = await this.repository.save(hero);
  }

  constructor(private readonly repository: HeroRepository) {}
}
