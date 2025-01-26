import { drizzle } from "drizzle-orm/neon-serverless";
import { WebSocket } from "ws";
import * as schema from "@db/schema";

if (!process.env.DATABASE_URL) {
  throw new Error(
    "DATABASE_URL must be set. Did you forget to provision a database?",
  );
}

const MAX_RETRIES = 5;
const RETRY_DELAY = 5000; // 5 seconds

class DatabaseConnection {
  private static instance: ReturnType<typeof drizzle>;
  private static connecting = false;
  private static connectionPromise: Promise<ReturnType<typeof drizzle>> | null = null;
  private static wsClient: WebSocket | null = null;

  static async getInstance(retryCount = 0): Promise<ReturnType<typeof drizzle>> {
    if (this.instance) {
      return this.instance;
    }

    if (this.connecting) {
      return this.connectionPromise!;
    }

    this.connecting = true;
    this.connectionPromise = this.createConnection(retryCount);

    try {
      this.instance = await this.connectionPromise;
      this.connecting = false;
      return this.instance;
    } catch (error) {
      this.connecting = false;
      throw error;
    }
  }

  private static async createConnection(retryCount = 0): Promise<ReturnType<typeof drizzle>> {
    try {
      if (!process.env.DATABASE_URL) {
        throw new Error("DATABASE_URL is not defined");
      }

      // Close existing connection if any
      if (this.wsClient) {
        this.wsClient.terminate();
        this.wsClient = null;
      }

      console.log("Attempting to connect to database...");
      this.wsClient = new WebSocket(process.env.DATABASE_URL);

      return new Promise((resolve, reject) => {
        let connected = false;

        if (!this.wsClient) {
          reject(new Error("WebSocket client not initialized"));
          return;
        }

        const timeout = setTimeout(() => {
          if (!connected) {
            this.wsClient?.terminate();
            reject(new Error("Connection timeout"));
          }
        }, 10000); // 10 second timeout

        this.wsClient.on('error', (error) => {
          console.error('WebSocket connection error:', error);
          if (!connected) {
            clearTimeout(timeout);
            reject(error);
          }
        });

        this.wsClient.on('close', () => {
          console.log("WebSocket connection closed");
          if (!connected) {
            clearTimeout(timeout);
            reject(new Error("WebSocket closed before connection was established"));
          } else {
            // If we lose connection after being connected, attempt to reconnect
            this.instance = undefined;
            setTimeout(() => {
              console.log("Attempting to reconnect after connection loss...");
              this.getInstance(0).catch(console.error);
            }, RETRY_DELAY);
          }
        });

        this.wsClient.on('open', () => {
          try {
            console.log("WebSocket connection opened");
            connected = true;
            clearTimeout(timeout);

            const db = drizzle({
              connection: process.env.DATABASE_URL!,
              schema,
              ws: this.wsClient!,
            });

            console.log("Database connection established successfully");
            resolve(db);
          } catch (error) {
            console.error("Failed to create drizzle instance:", error);
            reject(error);
          }
        });
      }).catch(async (error) => {
        console.error("Database connection error:", error);
        if (retryCount < MAX_RETRIES) {
          console.log(`Retrying connection in ${RETRY_DELAY / 1000} seconds... (Attempt ${retryCount + 1}/${MAX_RETRIES})`);
          await new Promise(resolve => setTimeout(resolve, RETRY_DELAY));
          return this.createConnection(retryCount + 1);
        }
        console.error("Max retry attempts reached:", error);
        throw error;
      });
    } catch (error) {
      if (retryCount < MAX_RETRIES) {
        console.log(`Retrying connection in ${RETRY_DELAY / 1000} seconds... (Attempt ${retryCount + 1}/${MAX_RETRIES})`);
        await new Promise(resolve => setTimeout(resolve, RETRY_DELAY));
        return this.createConnection(retryCount + 1);
      }
      throw error;
    }
  }

  static async checkConnection(): Promise<boolean> {
    try {
      const db = await this.getInstance();
      // Attempt a simple query to verify connection
      await db.select().from(schema.betaSignups).limit(1);
      return true;
    } catch (error) {
      console.error("Database connection check failed:", error);
      return false;
    }
  }

  static async disconnect(): Promise<void> {
    if (this.wsClient) {
      this.wsClient.terminate();
      this.wsClient = null;
    }
    this.instance = undefined;
    this.connecting = false;
    this.connectionPromise = null;
    console.log("Database connection closed");
  }
}

// Initialize database connection
let db: ReturnType<typeof drizzle>;
try {
  console.log("Initializing database connection...");
  db = await DatabaseConnection.getInstance();
} catch (error) {
  console.error("Failed to initialize database connection:", error);
  throw error;
}

// Handle process termination
process.on('SIGTERM', async () => {
  console.log('Received SIGTERM signal. Closing database connections...');
  await DatabaseConnection.disconnect();
  process.exit(0);
});

process.on('SIGINT', async () => {
  console.log('Received SIGINT signal. Closing database connections...');
  await DatabaseConnection.disconnect();
  process.exit(0);
});

export { db, DatabaseConnection };