import Discord, { Message, GatewayIntentBits } from 'discord.js';
import { CommandHandler } from './command-handler';
import dotenv from 'dotenv';

const client = new Discord.Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages] });
const commandHandler = new CommandHandler('!');

dotenv.config();

client.on('ready', () => {
   if (client.user) {
      console.log(`Logged in as ${client.user.tag}`);
   }
});

client.on('message', async (message: Message) => {
   commandHandler.handleMessage(message);
});

client.on('error', (e) => {
   console.error('Discord client error!', e);
});

console.log('Logging in');
client.login(process.env.TOKEN);
