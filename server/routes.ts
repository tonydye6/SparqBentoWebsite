import type { Express } from "express";
import { createServer, type Server } from "http";
import { db } from "@db";  // Remove DatabaseConnection as it's not exported
import { betaSignups, adminUsers, newsItems, teamMembers } from "@db/schema";
import { eq, desc } from "drizzle-orm";
import session from "express-session";
import { requireAdmin, adminSessionMiddleware } from "./middleware/auth";
import bcrypt from "bcryptjs";
import MemoryStore from "memorystore";
import rateLimit from 'express-rate-limit';

const SessionStore = MemoryStore(session);

// Configure rate limiters for different services
const chatLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 50, // Limit each IP to 50 requests per windowMs
  message: { message: "Too many requests, please try again later." }
});

const discordLimiter = rateLimit({
  windowMs: 5 * 60 * 1000, // 5 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: { message: "Too many Discord widget requests, please try again later." }
});

const newsLimiter = rateLimit({
  windowMs: 5 * 60 * 1000, // 5 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: { message: "Too many news feed requests, please try again later." }
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
        if (!process.env.PERPLEXITY_API_KEY) {
          throw new Error('Chat service configuration missing');
        }
        break;
      case 'news':
        const newsCache = await db.select().from(newsItems).limit(1);
        if (!newsCache) {
          throw new Error('News service unavailable');
        }
        break;
      case 'discord':
        // Discord widget is client-side, just verify configuration
        break;
    }

    healthStatus[service] = { status: 'healthy', lastCheck: Date.now() };
  } catch (error) {
    console.error(`Health check failed for ${service}:`, error);
    healthStatus[service] = { status: 'unhealthy', lastCheck: Date.now() };
  }
}

// Periodic health checks
const startHealthChecks = () => {
  const interval = setInterval(() => {
    Object.keys(healthStatus).forEach(service => {
      checkServiceHealth(service as keyof typeof healthStatus);
    });
  }, 60000); // Check every minute

  return interval;
};

// News fetch function using Perplexity API
async function fetchLatestNews() {
  if (!process.env.PERPLEXITY_API_KEY) {
    throw new Error("Perplexity API key not configured");
  }

  const response = await fetch("https://api.perplexity.ai/chat/completions", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${process.env.PERPLEXITY_API_KEY}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      model: "llama-3.1-sonar-small-128k-online",
      messages: [
        {
          role: "system",
          content: "You are a news aggregator for Sparq Games. Provide the latest gaming industry news in a structured format. Each news item should have a title and description."
        },
        {
          role: "user",
          content: "Provide 3 latest news items about gaming industry, sports games, or gaming technology. Format as JSON with title, description, and category fields."
        }
      ],
      temperature: 0.3,
      max_tokens: 500,
      stream: false
    })
  });

  if (!response.ok) {
    const error = await response.text();
    console.error("Perplexity API error:", error);
    throw new Error(`Failed to fetch news: ${error}`);
  }

  const data = await response.json();
  const newsData = JSON.parse(data.choices[0].message.content);

  // Try to save to database, but don't fail if database is unavailable
  try {
    for (const item of newsData) {
      await db.insert(newsItems).values({
        title: item.title,
        content: item.description,
        category: item.category,
        active: true
      });
    }
    console.log("Successfully saved news items to database");
  } catch (error) {
    console.error("Failed to save news items to database:", error);
    // Continue with returning the news data even if database save fails
  }

  return newsData;
}

// Cache for storing news when database is unavailable
let newsCache: any[] = [];
let newsRefreshInterval: NodeJS.Timeout;

function startNewsRefresh() {
  // Clear any existing interval
  if (newsRefreshInterval) {
    clearInterval(newsRefreshInterval);
  }

  // Initial fetch
  fetchLatestNews().then(news => {
    newsCache = news;
    console.log("Initial news feed loaded");
  }).catch(error => {
    console.error("Failed to load initial news feed:", error);
  });

  // Refresh news every hour
  newsRefreshInterval = setInterval(async () => {
    try {
      const news = await fetchLatestNews();
      newsCache = news; // Update cache
      console.log("News feed refreshed successfully");
    } catch (error) {
      console.error("Failed to refresh news feed:", error);
    }
  }, 60 * 60 * 1000); // 1 hour
}


export function registerRoutes(app: Express): Server {
  // Session setup with secure settings for Reserved VM
  app.use(session({
    store: new SessionStore({
      checkPeriod: 86400000 // prune expired entries every 24h
    }),
    secret: process.env.SESSION_SECRET || 'dev-secret-key',
    resave: false,
    saveUninitialized: false,
    cookie: { 
      secure: process.env.NODE_ENV === 'production',
      maxAge: 24 * 60 * 60 * 1000, // 24 hours
      sameSite: 'lax'
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
  app.use("/api/news", newsLimiter);


  // Existing routes with enhanced error handling
  app.get("/api/news", newsLimiter, async (req, res) => {
    try {
      let items = [];
      try {
        items = await db.select()
          .from(newsItems)
          .where(eq(newsItems.active, true))
          .orderBy(desc(newsItems.createdAt))
          .limit(3);
      } catch (error) {
        console.error("Database error fetching news:", error);
        healthStatus.database.status = 'unhealthy';
        // Fall back to cache if database is unavailable
        items = [];
      }

      if (!items?.length) {
        try {
          const freshNews = await fetchLatestNews();
          items = freshNews;
        } catch (error) {
          console.error("Error fetching fresh news:", error);
          healthStatus.news.status = 'unhealthy';
          return res.status(503).json({ 
            message: "News service temporarily unavailable",
            retry_after: 300 // 5 minutes
          });
        }
      }

      healthStatus.news.status = 'healthy';
      res.json(items);
    } catch (error) {
      console.error("Critical error in news endpoint:", error);
      healthStatus.news.status = 'unhealthy';
      res.status(500).json({ 
        message: "Unable to retrieve news",
        retry_after: 300
      });
    }
  });

  // Enhanced chat endpoint with health monitoring
  app.post("/api/chat", chatLimiter, async (req, res) => {
    try {
      if (!process.env.PERPLEXITY_API_KEY) {
        healthStatus.chat.status = 'unhealthy';
        throw new Error("Chat service not configured");
      }

      const response = await fetch("https://api.perplexity.ai/chat/completions", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${process.env.PERPLEXITY_API_KEY}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          model: "llama-3.1-sonar-small-128k-online",
          messages: [
            {
              role: "system",
              content: `You are Sparq Games' AI assistant. You should:
              - Provide knowledgeable responses about sports, gaming, and Sparq Games
              - Be friendly and enthusiastic while maintaining professionalism
              - Keep responses concise but informative (2-3 sentences)
              - Focus on Sparq's mission of revolutionizing sports gaming through innovation
              - When unsure, be honest and suggest contacting the Sparq team directly`
            },
            ...req.body.messages.slice(-4)
          ],
          temperature: 0.7,
          max_tokens: 150,
          stream: false
        })
      });

      if (!response.ok) {
        healthStatus.chat.status = 'unhealthy';
        throw new Error(`API Error: ${await response.text()}`);
      }

      healthStatus.chat.status = 'healthy';
      const data = await response.json();
      res.json(data);
    } catch (error: any) {
      console.error("Chat error:", error);
      healthStatus.chat.status = 'unhealthy';

      const statusCode = error.message.includes("Rate limit") ? 429 : 503;
      const message = statusCode === 429 
        ? "Chat service rate limit exceeded. Please try again later."
        : "Chat service temporarily unavailable. Please try again later.";

      res.status(statusCode).json({ 
        message,
        retry_after: statusCode === 429 ? 900 : 300 // 15 minutes for rate limit, 5 minutes for other errors
      });
    }
  });

  // Admin auth routes
  app.post("/api/admin/login", async (req, res) => {
    try {
      const { username, password } = req.body;

      const admin = await db.select().from(adminUsers)
        .where(eq(adminUsers.username, username))
        .limit(1)
        .then(results => results[0]);

      if (!admin) {
        return res.status(401).json({ message: "Invalid credentials" });
      }

      const passwordMatch = await bcrypt.compare(password, admin.password);

      if (!passwordMatch) {
        return res.status(401).json({ message: "Invalid credentials" });
      }

      req.session.adminUser = { id: admin.id, username: admin.username };

      res.json({ message: "Logged in successfully" });
    } catch (error) {
      console.error("Admin login error:", error);
      res.status(500).json({ message: "Login failed" });
    }
  });

  app.post("/api/admin/logout", requireAdmin, (req, res) => {
    req.session.destroy((err) => {
      if (err) {
        console.error("Logout error:", err);
        return res.status(500).json({ message: "Logout failed" });
      }
      res.json({ message: "Logged out successfully" });
    });
  });

  // Beta signups endpoint
  app.post("/api/beta-signup", async (req, res) => {
    try {
      const { email, subscribe } = req.body;

      const existing = await db.select().from(betaSignups)
        .where(eq(betaSignups.email, email))
        .limit(1)
        .then(results => results[0]);

      if (existing) {
        return res.status(400).json({ 
          message: "Email already registered for beta" 
        });
      }

      await db.insert(betaSignups).values({
        email,
        subscribed: subscribe
      });

      res.status(200).json({ 
        message: "Successfully signed up for beta" 
      });
    } catch (error) {
      console.error("Beta signup error:", error);
      res.status(500).json({ 
        message: "Failed to sign up for beta" 
      });
    }
  });

  // Protected admin endpoints
  app.get("/api/admin/beta-signups", requireAdmin, async (req, res) => {
    try {
      const signups = await db.select().from(betaSignups)
        .orderBy(desc(betaSignups.createdAt));
      res.json(signups);
    } catch (error) {
      console.error("Error fetching beta signups:", error);
      res.status(500).json({ message: "Failed to fetch beta signups" });
    }
  });

  // Content management endpoints
  app.get("/api/admin/news", requireAdmin, async (req, res) => {
    try {
      const items = await db.select().from(newsItems)
        .orderBy(desc(newsItems.createdAt));
      res.json(items);
    } catch (error) {
      console.error("Error fetching news items:", error);
      res.status(500).json({ message: "Failed to fetch news items" });
    }
  });

  app.post("/api/admin/news", requireAdmin, async (req, res) => {
    try {
      const { title, content, category } = req.body;
      const result = await db.insert(newsItems).values({
        title,
        content,
        category,
        active: true
      });
      res.status(201).json(result);
    } catch (error) {
      console.error("Error creating news item:", error);
      res.status(500).json({ message: "Failed to create news item" });
    }
  });

  // Team Members
  app.get("/api/admin/team", requireAdmin, async (req, res) => {
    try {
      const members = await db.select().from(teamMembers)
        .orderBy(desc(teamMembers.createdAt));
      res.json(members);
    } catch (error) {
      console.error("Error fetching team members:", error);
      res.status(500).json({ message: "Failed to fetch team members" });
    }
  });

  app.post("/api/admin/team", requireAdmin, async (req, res) => {
    try {
      const { name, title, photo, linkedIn, previousCompanies } = req.body;
      const result = await db.insert(teamMembers).values({
        name,
        title,
        photo,
        linkedIn,
        previousCompanies,
        active: true
      });
      res.status(201).json(result);
    } catch (error) {
      console.error("Error creating team member:", error);
      res.status(500).json({ message: "Failed to create team member" });
    }
  });

  // Start health checks
  const healthCheckInterval = startHealthChecks();

  // Cleanup function for graceful shutdown
  const cleanup = () => {
    if (healthCheckInterval) {
      clearInterval(healthCheckInterval);
    }
    if (newsRefreshInterval) {
      clearInterval(newsRefreshInterval);
    }
    console.log('Cleaning up resources...');
  };

  // Handle process termination
  process.on('SIGTERM', cleanup);
  process.on('SIGINT', cleanup);

  const httpServer = createServer(app);
  return httpServer;
}