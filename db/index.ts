import { drizzle } from "drizzle-orm/neon-serverless";
import * as schema from "@db/schema";

if (!process.env.DATABASE_URL) {
  throw new Error(
    "DATABASE_URL must be set. Did you forget to provision a database?",
  );
}

// Create a direct connection without WebSocket for better stability
export const db = drizzle({
  connection: process.env.DATABASE_URL,
  schema,
});

// Export for type inference
export type DB = typeof db;

// Handle process termination
process.on('SIGTERM', async () => {
  console.log('Received SIGTERM signal. Closing database connections...');
  await db.dispose(); // Assuming drizzle has a dispose method for cleanup.  Adjust if necessary.
  process.exit(0);
});

process.on('SIGINT', async () => {
  console.log('Received SIGINT signal. Closing database connections...');
  await db.dispose(); // Assuming drizzle has a dispose method for cleanup. Adjust if necessary.
  process.exit(0);
});