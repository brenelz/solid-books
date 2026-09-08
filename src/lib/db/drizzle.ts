import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";

const connectionString = process.env.POSTGRES_URL?.trim() || undefined;

export const sql = connectionString ? postgres(connectionString) : null;
export const db = sql ? drizzle(sql) : null;

export type SqlClient = postgres.Sql;

export function requireSql(): SqlClient {
  if (!sql) throw new Error("POSTGRES_URL environment variable is not set");
  return sql;
}

export function requireDb() {
  if (!db) throw new Error("POSTGRES_URL environment variable is not set");
  return db;
}

export async function closeSql() {
  if (sql) await sql.end({ timeout: 5 });
}
