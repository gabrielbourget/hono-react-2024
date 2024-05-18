import { Config, defineConfig } from "drizzle-kit";

const { DATABASE_URL } = process.env;

export default defineConfig({
  schema: "./src/db/schema/index.ts",
  out: "./drizzle",
  dialect: "postgresql",
  dbCredentials: {
    url: DATABASE_URL!,
  },
  verbose: true,
  strict: true,
} satisfies Config);