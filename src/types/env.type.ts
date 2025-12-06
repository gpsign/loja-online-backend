export type Env = Readonly<{
  JWT_SECRET: string;
  DATABASE_URL: string;
  PORT?: string;
  [key: string]: string | undefined;
}>;
