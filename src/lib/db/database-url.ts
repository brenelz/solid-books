import { parseEnv } from "@neon/env";
import neonConfig from "../../../neon";

const missingUrlMessage =
  "DATABASE_URL is not set. Run `neon env pull` to write Neon credentials into .env.";

export function getPooledDatabaseUrl(): string | undefined {
  if (!process.env.DATABASE_URL?.trim()) return undefined;
  return parseEnv(neonConfig, ["DATABASE_URL"]).postgres.databaseUrl;
}

export function getUnpooledDatabaseUrl(): string | undefined {
  if (process.env.DATABASE_URL_UNPOOLED?.trim()) {
    return parseEnv(neonConfig, ["DATABASE_URL_UNPOOLED"]).postgres
      .databaseUrlUnpooled;
  }
  return getPooledDatabaseUrl();
}

export function requirePooledDatabaseUrl(): string {
  const url = getPooledDatabaseUrl();
  if (!url) throw new Error(missingUrlMessage);
  return url;
}

export function requireUnpooledDatabaseUrl(): string {
  const url = getUnpooledDatabaseUrl();
  if (!url) throw new Error(missingUrlMessage);
  return url;
}
