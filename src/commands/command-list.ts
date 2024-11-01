import { TextChannel } from 'discord.js';
import { CommandContext } from '../models/command-context';
import { Command } from './command';

export class CommandList implements Command {
   commandNames = ['commands', 'help', 'commandlist'];

   async run(parsedUserCommand: CommandContext): Promise<void> {
      //God forgive me for I have sinned
      const commands = `[Supporter & PP Farmer] !link <profile>
[Supporter & PP Farmer] !roll
`;
      const channel = parsedUserCommand.originalMessage.channel;
      if (channel.isTextBased()) {
         (channel as TextChannel).send(commands);
      }
   }

   hasPermissionToRun(parsedUserCommand: CommandContext): boolean {
      return true;
   }
}
