export {};

declare global {
  namespace NodeJS {
    interface ProcessEnv {
      NODE_ENV: string;
      PORT: number;
      HOST: string;
      DB_URI: string;
      JWT_SECRET: string;
      PUBLIC_KEY: string;
      SESSION_SECRET: string;
      GOOGLE_CLIENT_ID: string;
      GOOGLE_CLIENT_SECRET: string;
      GOOGLE_OAUTH_REDIRECT_URL: string;
    }
  }

  namespace Express {
    interface User extends IUser {}
  }
}
