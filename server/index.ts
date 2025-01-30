import express, { type Request, Response, NextFunction } from "express";
import { registerRoutes } from "./routes";
import { setupVite, serveStatic, log } from "./vite";
import path from "path";
import cors from 'cors';

const app = express();

// Configure CORS for production environment
const corsOptions = {
  origin: process.env.NODE_ENV === 'production' 
    ? ['https://sparqgames.com', /\.sparqgames\.com$/] // Allow main domain and subdomains
    : true, // Allow all origins in development
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true, // Allow credentials (cookies)
  maxAge: 86400, // Cache preflight requests for 24 hours
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
      res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains'); // Enable HSTS
    }
  }
}));

// Request logging middleware
app.use((req, res, next) => {
  const start = Date.now();
  const path = req.path;
  let capturedJsonResponse: Record<string, any> | undefined = undefined;

  const originalResJson = res.json;
  res.json = function (bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };

  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path.startsWith("/api")) {
      let logLine = `${req.method} ${path} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }

      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "…";
      }

      log(logLine);
    }
  });

  next();
});

(async () => {
  const server = registerRoutes(app);

  // Global error handler
  app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";

    // Don't expose error details in production
    const response = process.env.NODE_ENV === 'production' 
      ? { message: 'Internal Server Error' }
      : { message, stack: err.stack };

    res.status(status).json(response);

    // Log error details
    console.error('Server Error:', {
      status,
      message: err.message,
      stack: err.stack,
      timestamp: new Date().toISOString()
    });
  });

  // importantly only setup vite in development and after
  // setting up all the other routes so the catch-all route
  // doesn't interfere with the other routes
  if (app.get("env") === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }

  // ALWAYS serve the app on port 5000
  // this serves both the API and the client
  const PORT = process.env.PORT || 5000;
  server.listen(PORT, "0.0.0.0", () => {
    log(`Server running in ${app.get('env')} mode on http://0.0.0.0:${PORT}`);
  });
})();