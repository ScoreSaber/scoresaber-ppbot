import Discord, { GatewayIntentBits } from 'discord.js';
import { LinkAccount } from './commands/account-management/link';
import { RollDice } from './commands/games/diceroll';
import { SendMessage } from './commands/admin/send-message';
import dotenv from 'dotenv';
import { existsSync } from 'fs';
import { resolve } from 'path';

// Load .env file if it exists, otherwise use process.env directly
if (existsSync(resolve(process.cwd(), '.env'))) {
   dotenv.config();
}

const client = new Discord.Client({
   intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent],
});

const commands = [new LinkAccount(), new RollDice(), new SendMessage()];

client.on('ready', async () => {
   if (!client.application) return;

   await client.application.commands.set(commands.map((command) => command.slashCommandData));
   console.log(`Logged in as ${client.user?.tag}`);
});

client.on('interactionCreate', async (interaction) => {
   if (!interaction.isCommand()) return;

   const command = commands.find((cmd) => cmd.slashCommandData.name === interaction.commandName);

   if (!command) return;

   try {
      await command.execute(interaction);
   } catch (error) {
      console.error(error);
      await interaction.reply({
         content: 'There was an error executing this command!',
         ephemeral: true,
      });
   }
});

client.on('error', (e) => {
   console.error('Discord client error!', e);
});

client.login(process.env.TOKEN);
