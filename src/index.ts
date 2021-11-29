import Discord, { Message } from 'discord.js';
import disbut, { MessageComponent } from 'discord-buttons';
import { CommandHandler } from './command-handler';
import dotenv from 'dotenv';

const client = new Discord.Client();
const commandHandler = new CommandHandler('!');

dotenv.config();
disbut(client);

client.on('ready', () => {
   if (client.user) {
      console.log(`Logged in as ${client.user.tag} pog`);
      client.user.setActivity({ type: 'COMPETING', name: 'beating you up' });
   }
});

client.on('message', async (message: Message) => {
   commandHandler.handleMessage(message);
});

client.on('error', (e) => {
   console.error('Discord client error!', e);
});

client.on('clickButton', async (button: MessageComponent) => {
   // We can do fancy button handlers in here 😳
});

console.log('Logging in');
client.login(process.env.TOKEN);
