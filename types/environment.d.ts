declare global {
   namespace NodeJS {
      interface ProcessEnv {
         TOKEN: string;
         ADMIN_ROLE: string;
         PANDA_ROLE: string;
         SUPPORTER_ROLE: string;
         PPFARMER_ROLE: string;
         ALL_STAFF_ROLES: string;
         BOT_KEY: string;
         API_PATH: string;
         ACCOUNT_LINKING_CHANNEL: string;
      }
   }
}
export {};
