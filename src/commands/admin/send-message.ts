import axios from 'axios';
import { TextChannel } from 'discord.js';
import { CommandContext } from '../../models/command-context';
import { Command } from '../command';

export class SendMessage implements Command {
   commandNames = ['sendmessage'];

   async run(parsedUserCommand: CommandContext): Promise<void> {
      if (parsedUserCommand.args.length >= 3) {
         if (parsedUserCommand.originalMessage.guild) {
            const mode = parsedUserCommand.args[0];
            const channel = parsedUserCommand.originalMessage.guild.channels.cache.get(parsedUserCommand.args[1]) as TextChannel;
            if (channel) {
               let messageContents = parsedUserCommand.args[2];

               if (mode == 'link') {
                  const messageData = await axios.get(messageContents);
                  if (messageData.status == 200) {
                     messageContents = messageData.data;
                  }
               }

               const message = await channel.send(messageContents);
               if (message) {
                  if (parsedUserCommand.args[3]) {
                     if (parsedUserCommand.args[3] == 'pin') {
                        await message.pin();
                     }
                     if (parsedUserCommand.args[3] == 'publish') {
                        await message.crosspost();
                     }
                  }
               }
            }
         }
      } else {
         parsedUserCommand.originalMessage.reply('Usage: !sendmessage <mode> <channelId> <messageContents> *<extraFunction>');
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
