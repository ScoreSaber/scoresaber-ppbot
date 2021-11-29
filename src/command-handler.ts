import { Message } from 'discord.js';
import { CommandContext } from './models/command-context';
import { Command } from './commands/command';

import { LinkAccount } from './commands/account-management/link';
import { RollDice } from './commands/games/diceroll';
import { CommandList } from './commands/command-list';

export class CommandHandler {
   private commands: Command[];
   private readonly prefix: string;

   constructor(prefix: string) {
      const commandClasses = [CommandList, LinkAccount, RollDice];
      this.commands = commandClasses.map((CommandClass) => new CommandClass());
      this.prefix = prefix;
   }

   async handleMessage(message: Message) {
      if (message.author.bot || !this.isCommand(message)) {
         return;
      }
      const commandContext = new CommandContext(message, this.prefix);
      const allowedCommands = this.commands.filter((command) => command.hasPermissionToRun(commandContext));
      const matchedCommand = this.commands.find((command) => command.commandNames.includes(commandContext.parsedCommandName));
      if (matchedCommand) {
         if (allowedCommands.includes(matchedCommand)) {
            await matchedCommand.run(commandContext).catch((reason) => {
               console.log(`Failed to run command: ${reason}`);
            });
         }
      }
   }
   private isCommand(message: Message): boolean {
      return message.content.startsWith(this.prefix);
   }
}
