import { Message } from 'discord.js';

export class CommandContext {
   readonly parsedCommandName: string;
   readonly args: string[];
   readonly originalMessage: Message;
   readonly commandPrefix: string;

   constructor(message: Message, prefix: string) {
      this.commandPrefix = prefix;
      const splitMessage = message.content
         .slice(prefix.length)
         .match(/\\?.|^$/g)!
         .reduce(
            (p: any, c: any) => {
               if (c === '"') {
                  p.quote ^= 1;
               } else if (!p.quote && c === ' ') {
                  p.a.push('');
               } else {
                  p.a[p.a.length - 1] += c.replace(/\\(.)/, '$1');
               }
               return p;
            },
            { a: [''] }
         ).a;

      this.parsedCommandName = splitMessage.shift()!.toLowerCase();
      this.args = splitMessage;
      this.originalMessage = message;
   }
}
