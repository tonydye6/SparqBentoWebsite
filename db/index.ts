
import { drizzle } from "drizzle-orm/neon-http";
import { neon } from '@neondatabase/serverless';

if (!process.env.DATABASE_URL) {
  throw new Error(
    "DATABASE_URL must be set. Did you forget to provision a database?",
  );
}

// Create a connection using HTTP instead of WebSocket
const sql = neon(process.env.DATABASE_URL);
export const db = drizzle(sql);

// Export for type inference
export type DB = typeof db;

// Handle process termination
process.on('SIGTERM', () => {
  console.log('Received SIGTERM signal.');
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('Received SIGINT signal.');
  process.exit(0);
});
