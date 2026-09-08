import "./load-env";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { drizzle } from "drizzle-orm/postgres-js";
import { migrate } from "drizzle-orm/postgres-js/migrator";
import postgres from "postgres";
import { requireUnpooledDatabaseUrl } from "./database-url";

const sql = postgres(requireUnpooledDatabaseUrl(), { max: 1 });

async function main() {
  await migrate(drizzle(sql), {
    migrationsFolder: path.join(path.dirname(fileURLToPath(import.meta.url)), "migrations"),
  });
  console.log("Migrations complete");
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await sql.end({ timeout: 5 });
  });
