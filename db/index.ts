import { drizzle } from "drizzle-orm/neon-serverless";
import ws from "ws";
import * as schema from "@db/schema";

if (!process.env.DATABASE_URL) {
  throw new Error(
    "DATABASE_URL must be set. Did you forget to provision a database?",
  );
}

const MAX_RETRIES = 5;
const RETRY_DELAY = 5000; // 5 seconds

function createConnection(retryCount = 0) {
  try {
    const wsClient = new ws.WebSocket(process.env.DATABASE_URL);

    wsClient.on('error', (error) => {
      console.error('WebSocket connection error:', error);
      // The connection will automatically attempt to reconnect
    });

    const db = drizzle({
      connection: process.env.DATABASE_URL,
      schema,
      ws: wsClient,
    });

    console.log("Database connection established successfully");
    return db;
  } catch (error) {
    console.error("Database connection error:", error);

    if (retryCount < MAX_RETRIES) {
      console.log(`Retrying connection in ${RETRY_DELAY / 1000} seconds... (Attempt ${retryCount + 1}/${MAX_RETRIES})`);
      return new Promise((resolve) => {
        setTimeout(() => resolve(createConnection(retryCount + 1)), RETRY_DELAY);
      });
    } else {
      console.error("Max retry attempts reached. Unable to establish database connection.");
      throw error;
    }
  }
}

// Initialize database connection with retry logic
export const db = createConnection();

process.on('SIGTERM', () => {
  console.log('Received SIGTERM signal. Closing database connections...');
  // Cleanup logic here if needed
});

process.on('SIGINT', () => {
  console.log('Received SIGINT signal. Closing database connections...');
  // Cleanup logic here if needed
});