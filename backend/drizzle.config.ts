import { Config, defineConfig } from "drizzle-kit";

const { DATABASE_HOST, DATABASE_USER, DATABASE_PASSWORD, DATABASE_NAME } = process.env;

export default defineConfig({
  schema: "./src/db/schema/index.ts",
  out: "./src/db/migrations",
  dialect: "postgresql",
  dbCredentials: {
    host: DATABASE_HOST!,
    user: DATABASE_USER!,
    password: DATABASE_PASSWORD!,
    database: DATABASE_NAME!,
  },
  verbose: true,
  strict: true,
} satisfies Config);