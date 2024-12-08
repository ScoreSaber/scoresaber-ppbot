import axios from 'axios';
import { SlashCommandBuilder, CommandInteraction, ChannelType, TextChannel } from 'discord.js';
import { Command } from '../command';

export class SendMessage implements Command {
   description = 'Send a message to a channel';

   slashCommandData = new SlashCommandBuilder()
      .setName('sendmessage')
      .setDescription('Send a message to a channel')
      .addStringOption((option) =>
         option
            .setName('mode')
            .setDescription('Message mode (direct or link)')
            .setRequired(true)
            .addChoices({ name: 'Direct Message', value: 'direct' }, { name: 'From Link', value: 'link' })
      )
      .addChannelOption((option) =>
         option.setName('channel').setDescription('Channel to send the message to').setRequired(true).addChannelTypes(ChannelType.GuildText, ChannelType.GuildAnnouncement)
      )
      .addStringOption((option) => option.setName('content').setDescription('Message content or link to content').setRequired(true))
      .addStringOption((option) =>
         option.setName('action').setDescription('Additional action to perform').addChoices({ name: 'Pin Message', value: 'pin' }, { name: 'Publish/Crosspost', value: 'publish' })
      )
      .setDefaultMemberPermissions('0')
      .toJSON();

   async execute(interaction: CommandInteraction): Promise<void> {
      await interaction.deferReply({ ephemeral: true });

      const mode = interaction.options.get('mode')?.value as string;
      const channel = interaction.options.get('channel')?.channel as TextChannel;
      const content = interaction.options.get('content')?.value as string;
      const action = interaction.options.get('action')?.value as string;

      if (!channel?.isTextBased()) {
         await interaction.editReply('Invalid channel selected.');
         return;
      }

      try {
         let messageContent = content;

         if (mode === 'link') {
            const messageData = await axios.get(content);
            if (messageData.status !== 200) {
               await interaction.editReply('Failed to fetch message content from link.');
               return;
            }
            messageContent = messageData.data;
         }

         const message = await channel.send(messageContent);

         if (action) {
            if (action === 'pin') {
               await message.pin();
            } else if (action === 'publish' && 'crosspost' in channel) {
               await message.crosspost();
            }
         }

         await interaction.editReply(`Message sent successfully to ${channel.name}`);
      } catch (error) {
         console.error('Error sending message:', error);
         await interaction.editReply('Failed to send message. Please check the inputs and try again.');
      }
   }
}
