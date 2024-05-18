import { drizzle } from 'drizzle-orm/postgres-js';
// import { migrate } from 'drizzle-orm/postgres-js/migrator';
import postgres from 'postgres';

const { DATABASE_URL } = process.env;

// for query purposes
const queryClient = postgres(DATABASE_URL!);
export const db = drizzle(queryClient);