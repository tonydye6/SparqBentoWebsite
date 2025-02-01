import pkg from 'pg';
const { Pool } = pkg;
import { drizzle } from 'drizzle-orm/node-postgres';
import * as schema from "@db/schema";

if (!process.env.DATABASE_URL) {
  throw new Error(
    "DATABASE_URL must be set. Did you forget to provision a database?",
  );
}

// Create a PostgreSQL pool with more resilient settings
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  max: 1, // Limit to single connection for Replit environment
  idleTimeoutMillis: 10000,
  connectionTimeoutMillis: 2000,
  query_timeout: 5000,
});

// Add error handler for the pool
pool.on('error', (err: Error) => {
  console.error('Unexpected error on idle client', err);
  // Don't exit process, just log the error
  console.error('Database error occurred, attempting to recover...');
});

// Create the drizzle database instance
const db = drizzle(pool, { schema });

// Export both pool and db
export { db, pool };

// Test database connection
async function testConnection() {
  try {
    const client = await pool.connect();
    console.log('Successfully connected to database');
    client.release();
    return true;
  } catch (error) {
    console.error('Error connecting to database:', (error as Error).message);
    return false;
  }
}

// Export test function
export { testConnection };

process.on('SIGTERM', async () => {
  console.log('Received SIGTERM signal. Closing database connections...');
  await pool.end();
  process.exit(0);
});

process.on('SIGINT', async () => {
  console.log('Received SIGINT signal. Closing database connections...');
  await pool.end();
  process.exit(0);
});