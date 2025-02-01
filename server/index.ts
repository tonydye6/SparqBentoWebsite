import express, { type Request, Response, NextFunction } from "express";
import { registerRoutes } from "./routes";
import { setupVite, serveStatic, log } from "./vite";
import path from "path";
import cors from 'cors';
import { db, testConnection } from "@db";
import { newsItems } from "@db/schema";

const app = express();

// Configure CORS for production environment
const corsOptions = {
  origin: process.env.NODE_ENV === 'production' 
    ? ['https://sparqgames.com', /\.sparqgames\.com$/]
    : true,
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
  maxAge: 86400,
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Serve static files from client/public directory with explicit MIME types
app.use(express.static(path.join(process.cwd(), 'client', 'public'), {
  setHeaders: (res, filePath) => {
    if (filePath.endsWith('.mp4')) {
      res.setHeader('Content-Type', 'video/mp4');
    } else if (filePath.endsWith('.webm')) {
      res.setHeader('Content-Type', 'video/webm');
    } else if (filePath.endsWith('.png')) {
      res.setHeader('Content-Type', 'image/png');
    } else if (filePath.endsWith('.jpg') || filePath.endsWith('.jpeg')) {
      res.setHeader('Content-Type', 'image/jpeg');
    }
    // Add security headers for production
    if (process.env.NODE_ENV === 'production') {
      res.setHeader('X-Content-Type-Options', 'nosniff');
      res.setHeader('X-Frame-Options', 'DENY');
      res.setHeader('X-XSS-Protection', '1; mode=block');
      res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
    }
  }
}));

// Request logging middleware
app.use((req, res, next) => {
  const start = Date.now();
  res.on("finish", () => {
    const duration = Date.now() - start;
    if (req.path.startsWith("/api")) {
      log(`${req.method} ${req.path} ${res.statusCode} in ${duration}ms`);
    }
  });
  next();
});

// Initialize the server with database connection retries
async function initializeServer() {
  // Maximum time to wait for database (5 minutes)
  const maxWaitTime = 5 * 60 * 1000;
  const startTime = Date.now();

  while (Date.now() - startTime < maxWaitTime) {
    try {
      // Test database connection
      const isConnected = await testConnection();
      if (isConnected) {
        console.log('Database connection established successfully');

        // Only proceed with server setup after successful database connection
        const server = registerRoutes(app);

        // Global error handler
        app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
          console.error('Server Error:', {
            status: err.status || 500,
            message: err.message,
            stack: err.stack,
            timestamp: new Date().toISOString()
          });

          const status = err.status || err.statusCode || 500;
          const message = process.env.NODE_ENV === 'production'
            ? 'Internal Server Error'
            : err.message || 'Internal Server Error';

          res.status(status).json({ message });
        });

        if (app.get("env") === "development") {
          await setupVite(app, server);
        } else {
          serveStatic(app);
        }

        const PORT = process.env.PORT || 5000;
        server.listen(Number(PORT), "0.0.0.0", () => {
          log(`Server running in ${app.get('env')} mode on http://0.0.0.0:${PORT}`);
        });

        return;
      }
    } catch (error) {
      console.error('Server initialization error:', error);
      // Wait for 5 seconds before retrying
      await new Promise(resolve => setTimeout(resolve, 5000));
    }
  }

  throw new Error('Failed to initialize server: Database connection timeout');
}

// Start the server
initializeServer().catch(error => {
  console.error('Fatal error during server initialization:', error);
  process.exit(1);
});