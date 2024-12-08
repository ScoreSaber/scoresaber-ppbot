import { ApplicationCommandDataResolvable, CommandInteraction } from 'discord.js';

export interface Command {
   slashCommandData: ApplicationCommandDataResolvable;
   execute(interaction: CommandInteraction): Promise<void>;
}
