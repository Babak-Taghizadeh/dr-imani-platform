import { Pool } from "pg";
import { drizzle } from "drizzle-orm/node-postgres";

const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  throw new Error(
    "DATABASE_URL environment variable is not set. Please check your .env file.",
  );
}

// Validate DATABASE_URL format
try {
  const url = new URL(databaseUrl);
  if (url.protocol !== "postgresql:" && url.protocol !== "postgres:") {
    throw new Error(`Invalid database protocol: ${url.protocol}`);
  }
} catch (error) {
  if (error instanceof TypeError) {
    throw new Error(
      `Invalid DATABASE_URL format. Expected format: postgresql://user:password@host:port/database`,
    );
  }
  throw error;
}

const pool = new Pool({
  connectionString: databaseUrl,
  idleTimeoutMillis: 1000,
  connectionTimeoutMillis: 1000,
});

export const db = drizzle(pool);
