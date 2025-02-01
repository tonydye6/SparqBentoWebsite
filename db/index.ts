import pkg from 'pg';
const { Pool } = pkg;
import { drizzle } from 'drizzle-orm/node-postgres';
import * as schema from "@db/schema";

if (!process.env.DATABASE_URL) {
  throw new Error(
    "DATABASE_URL must be set. Did you forget to provision a database?",
  );
}

// Create a PostgreSQL pool with optimized settings for Replit
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  max: 1, // Limit to single connection for Replit environment
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 10000,
  query_timeout: 20000,
  ssl: {
    rejectUnauthorized: false // Required for some Replit PostgreSQL connections
  }
});

// Improved error handler for the pool
pool.on('error', (err: Error) => {
  console.error('Unexpected error on idle client:', err);
  // Don't exit process, just log the error and attempt recovery
  console.error('Database error occurred, attempting to recover...');
});

// Create the drizzle database instance
const db = drizzle(pool, { schema });

// Enhanced connection testing with retries and proper error handling
async function testConnection(maxRetries = 5): Promise<boolean> {
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      const client = await pool.connect();
      try {
        // Test query to verify connection is working
        await client.query('SELECT 1');
        console.log('Successfully connected to database');
        return true;
      } finally {
        client.release();
      }
    } catch (error) {
      console.error(`Database connection attempt ${attempt} failed:`, (error as Error).message);
      if (attempt === maxRetries) {
        console.error('Max retries reached, database connection failed');
        return false;
      }
      // Exponential backoff with jitter
      const backoff = Math.min(1000 * Math.pow(2, attempt - 1) + Math.random() * 1000, 10000);
      await new Promise(resolve => setTimeout(resolve, backoff));
    }
  }
  return false;
}

// Export database instances and utilities
export { db, pool, testConnection };

// Initialize database connection with proper error handling
(async () => {
  try {
    const isConnected = await testConnection();
    if (!isConnected) {
      console.warn('Database connection failed after retries, application will use fallback mechanisms');
    } else {
      console.log('Database connection established successfully');
    }
  } catch (error) {
    console.error('Error during database initialization:', error);
  }
})();

// Graceful shutdown handlers
process.on('SIGTERM', async () => {
  console.log('Received SIGTERM signal. Closing database connections...');
  try {
    await pool.end();
    console.log('Database connections closed successfully');
  } catch (error) {
    console.error('Error closing database connections:', error);
  }
  process.exit(0);
});

process.on('SIGINT', async () => {
  console.log('Received SIGINT signal. Closing database connections...');
  try {
    await pool.end();
    console.log('Database connections closed successfully');
  } catch (error) {
    console.error('Error closing database connections:', error);
  }
  process.exit(0);
});