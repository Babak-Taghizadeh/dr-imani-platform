import { Pool } from "pg";
import { drizzle } from "drizzle-orm/node-postgres";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  // Allow connections to close quickly
  idleTimeoutMillis: 1000,
  // Fail fast if no connection available
  connectionTimeoutMillis: 1000,
});

export const db = drizzle(pool);
