import { CommandInteraction, SlashCommandBuilder } from 'discord.js';
import { Command } from '../command';

export class RollDice implements Command {
   description = 'Roll a six sided die';

   slashCommandData = new SlashCommandBuilder().setName('roll').setDescription('Roll a six sided die').setDefaultMemberPermissions('0').toJSON();

   async execute(interaction: CommandInteraction): Promise<void> {
      const min = 1;
      const max = 6;
      const result = min - 1 + Math.ceil(Math.random() * (max - min + 1));

      await interaction.reply({
         content: `🎲 ${interaction.user} rolled a ${result}!`,
         ephemeral: false,
      });
   }
}
