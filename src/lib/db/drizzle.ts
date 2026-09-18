import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { getPooledDatabaseUrl } from "./database-url";

const connectionString = getPooledDatabaseUrl();

export const sql = connectionString
  ? postgres(connectionString, {
      prepare: false,
      // The prerender crawl runs this module inside the `vite build` process
      // (see vite.config.ts). An open pool would keep that process alive
      // forever, so there it lets go of idle connections right away.
      ...(process.env.PRERENDERING && { idle_timeout: 1 }),
    })
  : null;
export const db = sql ? drizzle(sql) : null;

export type SqlClient = postgres.Sql;

const missingUrlMessage =
  "DATABASE_URL is not set. Run `neon env pull` to write Neon credentials into .env.";

export function requireSql(): SqlClient {
  if (!sql) throw new Error(missingUrlMessage);
  return sql;
}

export function requireDb() {
  if (!db) throw new Error(missingUrlMessage);
  return db;
}

export async function closeSql() {
  if (sql) await sql.end({ timeout: 5 });
}
