import { CommandInteraction, SlashCommandBuilder } from 'discord.js';
import { Command } from '../command';
import axios from 'axios';
import { ScoreSaberError } from '../../models/generic-responses';

export class LinkAccount implements Command {
   description = 'Link your patreon account to your discord account';

   slashCommandData = new SlashCommandBuilder()
      .setName('link')
      .setDescription('Link or refresh your patreon account')
      .addStringOption((option) => option.setName('profile').setDescription('Your ScoreSaber profile URL').setRequired(true))
      .setDefaultMemberPermissions('0')
      .toJSON();

   async execute(interaction: CommandInteraction): Promise<void> {
      const profileUrl = interaction.options.get('profile')?.value as string;
      const scoreSaberRegex = /^https:\/\/scoresaber\.com\/u\/\d{16,17}$/;

      if (!scoreSaberRegex.test(profileUrl)) {
         await interaction.reply({ content: 'You have entered your profile URL incorrectly', ephemeral: true });
         return;
      }

      const endpoint = `${process.env.API_PATH}/api/bot/update-patron`;
      const playerId = profileUrl.split('/').pop();

      if (!interaction.member) {
         await interaction.reply({ content: 'Failed to get member information', ephemeral: true });
         return;
      }

      const member = interaction.guild?.members.cache.get(interaction.user.id);
      if (!member) {
         await interaction.reply({ content: 'Failed to get member information', ephemeral: true });
         return;
      }

      let roleToAdd = 'none';
      if (member.roles.cache.has(process.env.SUPPORTER_ROLE!)) {
         roleToAdd = 'supporter';
      }
      if (member.roles.cache.has(process.env.PPFARMER_ROLE!)) {
         roleToAdd = 'pp-farmer';
      }

      try {
         const result = await axios.post(endpoint, {
            discordId: member.id,
            playerId: playerId,
            patronType: roleToAdd,
            key: process.env.BOT_KEY,
         });

         if (result.status === 200) {
            await interaction.reply({ content: 'You have successfully linked / refreshed your patreon account!', ephemeral: true });
         } else {
            await interaction.reply({ content: 'An error has occurred refreshing your patreon account', ephemeral: true });
         }
      } catch (ex) {
         if (axios.isAxiosError(ex)) {
            const scoreSaberError = ex.response?.data as ScoreSaberError;
            await interaction.reply({ content: scoreSaberError.errorMessage, ephemeral: true });
         } else {
            await interaction.reply({ content: 'An error has occurred refreshing your patreon account', ephemeral: true });
         }
      }
   }
}
