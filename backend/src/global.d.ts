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
    }
  }

  namespace Express {
    interface User extends IUser {}
  }
}
