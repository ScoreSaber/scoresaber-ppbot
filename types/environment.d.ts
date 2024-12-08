declare global {
   namespace NodeJS {
      interface ProcessEnv {
         TOKEN: string;
         SUPPORTER_ROLE: string;
         PPFARMER_ROLE: string;
         BOT_KEY: string;
         API_PATH: string;
      }
   }
}
export {};
