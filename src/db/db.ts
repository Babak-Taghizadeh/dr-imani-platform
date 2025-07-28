import { Pool } from "pg";
import { drizzle } from "drizzle-orm/node-postgres";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  idleTimeoutMillis: 1000,
  connectionTimeoutMillis: 1000,
});

export const db = drizzle(pool);
