import "dotenv/config";
import { Env } from "types";

const REQUIRED_KEYS = ["JWT_SECRET", "DATABASE_URL"] as const;

const missing: string[] = [];
for (const key of REQUIRED_KEYS) {
  if (process.env[key]) continue;
  missing.push(`Missing required environment variable: ${key}`);
}

if (missing.length) throw missing.join("\n");

export const AppEnv: Env = {
  JWT_SECRET: process.env.JWT_SECRET ?? "",
  DATABASE_URL: process.env.DATABASE_URL ?? "",
} as const;
