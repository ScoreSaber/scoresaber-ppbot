import { TextChannel } from 'discord.js';
import { CommandContext } from '../../models/command-context';
import { Command } from '../command';

export class CommandList implements Command {
   commandNames = ['sendmessage'];

   async run(parsedUserCommand: CommandContext): Promise<void> {
      if (parsedUserCommand.args.length == 2) {
         if (parsedUserCommand.originalMessage.guild) {
            const channel = parsedUserCommand.originalMessage.guild.channels.cache.get(parsedUserCommand.args[0]) as TextChannel;
            if (channel) {
               const message = await channel.send(parsedUserCommand.args[1]);
               if (message) {
                  if (parsedUserCommand.args[2]) {
                     if (parsedUserCommand.args[2] == 'pin') {
                        await message.pin();
                     }
                     if (parsedUserCommand.args[2] == 'publish') {
                        await message.crosspost();
                     }
                  }
               }
            }
         }
      }
   }

   hasPermissionToRun(parsedUserCommand: CommandContext): boolean {
      if (parsedUserCommand.originalMessage.member) {
         if (parsedUserCommand.originalMessage.member.roles.cache.has(process.env.PANDA_ROLE)) {
            return true;
         }
      }
      return false;
   }
}
