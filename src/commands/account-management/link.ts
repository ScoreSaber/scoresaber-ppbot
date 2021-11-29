import { CommandContext } from '../../models/command-context';
import { Command } from '../command';
import axios from 'axios';
import { ScoreSaberError } from '../../models/generic-responses';

export class LinkAccount implements Command {
   commandNames = ['link', 'refresh'];

   async run(parsedUserCommand: CommandContext): Promise<void> {
      if (parsedUserCommand.originalMessage.channel.id != process.env.ACCOUNT_LINKING_CHANNEL) {
         return;
      }
      if (parsedUserCommand.args.length == 1) {
         let fixedLink = parsedUserCommand.args[0].replace(/[^a-z0-9/:.]/gi, '');
         if (fixedLink.includes('&') || !fixedLink.includes('https://scoresaber.com/u/')) {
            await parsedUserCommand.originalMessage.reply('You have entered your profile URL incorrectly');
            return;
         }

         const endpoint = `${process.env.API_PATH}/api/bot/update-patron`;
         const discordUser = parsedUserCommand.originalMessage.member;
         const playerId = fixedLink.split('/').pop();
         if (discordUser) {
            let roleToAdd = 'none';
            if (discordUser.roles.cache.has(process.env.SUPPORTER_ROLE)) {
               roleToAdd = 'supporter';
            }
            if (discordUser.roles.cache.has(process.env.PPFARMER_ROLE)) {
               roleToAdd = 'pp-farmer';
            }
            try {
               const result = await axios.post(endpoint, { discordId: discordUser.id, playerId: playerId, patronType: roleToAdd, key: process.env.BOT_KEY });
               if (result.status == 200) {
                  await parsedUserCommand.originalMessage.reply('You have sucessfully linked / refreshed your patreon account!');
               } else {
                  await parsedUserCommand.originalMessage.reply('An error has occured refresion your patreon account');
               }
            } catch (ex) {
               if (axios.isAxiosError(ex)) {
                  const scoreSaberError = ex.response!.data as ScoreSaberError;
                  await parsedUserCommand.originalMessage.reply(scoreSaberError.errorMessage);
               } else {
                  await parsedUserCommand.originalMessage.reply('An error has occured refresion your patreon account');
               }
            }
         }
      } else {
         await parsedUserCommand.originalMessage.reply('You have entered your profile URL incorrectly');
      }
   }

   hasPermissionToRun(parsedUserCommand: CommandContext): boolean {
      if (parsedUserCommand.originalMessage.member) {
         if (parsedUserCommand.originalMessage.member.roles.cache.has(process.env.SUPPORTER_ROLE)) {
            return true;
         }
      }
      return false;
   }
}
