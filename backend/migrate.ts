import { drizzle } from "drizzle-orm/postgres-js";
import { migrate } from "drizzle-orm/postgres-js/migrator";
import postgres from "postgres";

const { DATABASE_URL } = process.env;

const migrationClient = postgres(DATABASE_URL!);
await migrate(drizzle(migrationClient), { migrationsFolder: "./drizzle" });
console.log("Migration complete ✅")
process.exit(0);