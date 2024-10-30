import { CommandContext } from '../../models/command-context';
import { Command } from '../command';

export class RollDice implements Command {
   commandNames = ['rolldice', 'diceroll', 'roll'];

   async run(parsedUserCommand: CommandContext): Promise<void> {
      const min = 1;
      const max = 6;
      const result = min - 1 + Math.ceil(Math.random() * (max - min + 1));

      parsedUserCommand.originalMessage.channel.send(result.toString());
   }

   hasPermissionToRun(parsedUserCommand: CommandContext): boolean {
      if (parsedUserCommand.originalMessage.member) {
         if (parsedUserCommand.originalMessage.member.roles.cache.has(process.env.SUPPORTER_ROLE) || parsedUserCommand.originalMessage.member.roles.cache.hasAny(...process.env.ALL_STAFF_ROLES.split(','))) {
            return true;
         }
      }
      return false;
   }
}
