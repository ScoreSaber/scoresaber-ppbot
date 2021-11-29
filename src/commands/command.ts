import { CommandContext } from '../models/command-context';

export interface Command {
   readonly commandNames: string[];
   run(parsedUserCommand: CommandContext): Promise<void>;
   hasPermissionToRun(parsedUserCommand: CommandContext): boolean;
}
