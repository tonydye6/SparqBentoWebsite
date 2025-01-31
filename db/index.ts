const pg = require('pg');
const { drizzle } = require('drizzle-orm/node-postgres');
const schema = require("@db/schema");

if (!process.env.DATABASE_URL) {
  throw new Error(
    "DATABASE_URL must be set. Did you forget to provision a database?",
  );
}

// Create a PostgreSQL pool
const pool = new pg.Pool({
  connectionString: process.env.DATABASE_URL,
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});

// Create the drizzle database instance
const db = drizzle(pool, { schema });

// Export both pool and db
module.exports = {
  db,
  pool
};

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