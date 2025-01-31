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
  max: 5, // Reduce max connections for Replit environment
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 5000,
  query_timeout: 10000,
  retry_strategy: (err, retries) => {
    if (retries > 5) return null; // Stop retrying after 5 attempts
    return Math.min(retries * 1000, 5000); // Exponential backoff with max 5s
  }
});

// Add error handler for the pool
pool.on('error', (err) => {
  console.error('Unexpected error on idle client', err);
  process.exit(-1);
});

// Create the drizzle database instance
const db = drizzle(pool, { schema });

// Export both pool and db
export { db, pool };

// Handle process termination
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

// Initial connection test
pool.connect()
  .then(client => {
    console.log('Successfully connected to database');
    client.release();
  })
  .catch(err => {
    console.error('Error connecting to database:', err.message);
    // Don't exit here, let the application handle reconnection
  });