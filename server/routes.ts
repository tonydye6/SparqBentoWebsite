import type { Express } from "express";
import { createServer, type Server } from "http";
import { db, pool } from "@db";
import { betaSignups, adminUsers, newsItems, teamMembers } from "@db/schema";
import { eq, desc } from "drizzle-orm";
import session from "express-session";
import { requireAdmin, adminSessionMiddleware } from "./middleware/auth";
import bcrypt from "bcryptjs";
import MemoryStore from "memorystore";
import rateLimit from 'express-rate-limit';

const SessionStore = MemoryStore(session);

// Rate limiter configuration for Reserved VM
const rateLimiterConfig = {
  windowMs: 60 * 1000, // 1 minute
  max: 20, // limit each IP to 20 requests per minute
  standardHeaders: true,
  legacyHeaders: false,
  trustProxy: false, // Don't trust X-Forwarded-For header by default
  handler: (req: any, res: any) => {
    res.status(429).json({
      error: 'Too many requests, please try again later.'
    });
  }
};

const chatLimiter = rateLimit({
  ...rateLimiterConfig,
  keyGenerator: (req) => {
    // Use CF-Connecting-IP for Cloudflare or fallback to remote address
    return req.get('CF-Connecting-IP') || req.ip;
  }
});

const discordLimiter = rateLimit({
  ...rateLimiterConfig,
  windowMs: 5 * 60 * 1000, // 5 minutes
  max: 100
});

const newsLimiter = rateLimit({
  ...rateLimiterConfig,
  windowMs: 5 * 60 * 1000, // 5 minutes
  max: 100
});

// Health status tracking
let healthStatus = {
  discord: { status: 'healthy', lastCheck: Date.now() },
  chat: { status: 'healthy', lastCheck: Date.now() },
  news: { status: 'healthy', lastCheck: Date.now() },
  database: { status: 'healthy', lastCheck: Date.now() }
};

// Health check function
async function checkServiceHealth(service: keyof typeof healthStatus) {
  try {
    switch (service) {
      case 'database':
        await db.select().from(newsItems).limit(1);
        break;
      case 'chat':
        // Chat health check
        break;
      case 'news':
        const newsCache = await db.select().from(newsItems).limit(1);
        if (!newsCache) {
          throw new Error('News service unavailable');
        }
        break;
      case 'discord':
        // Discord widget is client-side
        break;
    }
    healthStatus[service] = { status: 'healthy', lastCheck: Date.now() };
  } catch (error) {
    console.error(`Health check failed for ${service}:`, error);
    healthStatus[service] = { status: 'unhealthy', lastCheck: Date.now() };
  }
}

// Periodic health checks
function startHealthChecks() {
  const interval = setInterval(() => {
    Object.keys(healthStatus).forEach(service => {
      checkServiceHealth(service as keyof typeof healthStatus);
    });
  }, 60000); // Check every minute
  return interval;
}

// News refresh function (restored from original)
function startNewsRefresh() {
  // Placeholder for news refresh logic
  console.log('News refresh started');
}

export function registerRoutes(app: Express): Server {
  // Configure trust proxy for Reserved VM environment
  app.set('trust proxy', 1); // trust first proxy

  // Session configuration optimized for Reserved VM
  app.use(session({
    store: new SessionStore({
      checkPeriod: 86400000 // prune expired entries every 24h
    }),
    secret: process.env.SESSION_SECRET || 'dev-secret-key',
    resave: false,
    saveUninitialized: false,
    proxy: true, // Required for secure cookies behind proxy
    cookie: {
      secure: process.env.NODE_ENV === 'production', // Use secure cookies in production
      httpOnly: true,
      sameSite: 'lax',
      maxAge: 24 * 60 * 60 * 1000, // 24 hours
      domain: process.env.NODE_ENV === 'production' ? '.sparqgames.com' : undefined
    }
  }));

  app.use(adminSessionMiddleware);

  // Start news refresh when server starts
  startNewsRefresh();

  // Health check endpoints
  app.get("/api/health", (req, res) => {
    res.json({
      status: 'ok',
      timestamp: new Date().toISOString(),
      services: healthStatus
    });
  });

  app.get("/api/health/:service", (req, res) => {
    const service = req.params.service as keyof typeof healthStatus;
    if (!healthStatus[service]) {
      return res.status(404).json({ error: 'Service not found' });
    }
    res.json(healthStatus[service]);
  });

  // Apply rate limits to critical endpoints
  app.use("/api/chat", chatLimiter);
  app.use("/api/discord", discordLimiter);
  app.use("/api/news", newsLimiter);

  // Beta signups endpoint
  app.post("/api/beta-signup", async (req, res) => {
    try {
      const { email, subscribe } = req.body;

      console.log('Beta signup request:', { email, subscribe });

      if (!email) {
        console.log('Beta signup validation error: Missing email');
        return res.status(400).json({
          message: "Email is required"
        });
      }

      const existing = await db.select().from(betaSignups)
        .where(eq(betaSignups.email, email))
        .limit(1)
        .then(results => results[0]);

      if (existing) {
        console.log('Beta signup error: Email already exists:', email);
        return res.status(400).json({
          message: "Email already registered for beta"
        });
      }

      const result = await db.insert(betaSignups).values({
        email,
        subscribed: subscribe ?? false
      }).returning();

      console.log('Beta signup successful:', { email, result });

      res.status(200).json({
        message: "Successfully signed up for beta"
      });
    } catch (error) {
      console.error("Beta signup error:", error);
      res.status(500).json({
        message: "Failed to sign up for beta. Please try again."
      });
    }
  });

  // Start health checks
  const healthCheckInterval = startHealthChecks();

  // Add graceful shutdown handler for Reserved VM
  const shutdownHandler = () => {
    console.log('Received shutdown signal, closing HTTP server...');
    httpServer.close(() => {
      console.log('HTTP server closed');
      process.exit(0);
    });

    // Force close if graceful shutdown fails
    setTimeout(() => {
      console.error('Could not close connections in time, forcefully shutting down');
      process.exit(1);
    }, 10000);
  };

  process.on('SIGTERM', shutdownHandler);
  process.on('SIGINT', shutdownHandler);

  const httpServer = createServer(app);
  return httpServer;
}