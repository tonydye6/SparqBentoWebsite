import type { Express } from "express";
import { createServer, type Server } from "http";
import { db } from "@db";
import { betaSignups, adminUsers } from "@db/schema";
import { eq } from "drizzle-orm";
import session from "express-session";
import { requireAdmin, adminSessionMiddleware } from "./middleware/auth";
import bcrypt from "bcryptjs";
import MemoryStore from "memorystore";

const SessionStore = MemoryStore(session);

export function registerRoutes(app: Express): Server {
  // Session setup
  app.use(session({
    store: new SessionStore({
      checkPeriod: 86400000 // prune expired entries every 24h
    }),
    secret: process.env.SESSION_SECRET || 'dev-secret-key',
    resave: false,
    saveUninitialized: false,
    cookie: { 
      secure: process.env.NODE_ENV === 'production',
      maxAge: 24 * 60 * 60 * 1000 // 24 hours
    }
  }));

  app.use(adminSessionMiddleware);

  // Admin auth routes
  app.post("/api/admin/login", async (req, res) => {
    try {
      const { username, password } = req.body;
      console.log('Login attempt for username:', username);
      console.log('Received password:', password);

      const admin = await db.query.adminUsers.findFirst({
        where: eq(adminUsers.username, username)
      });

      if (!admin) {
        console.log('Admin not found');
        return res.status(401).json({ message: "Invalid credentials" });
      }

      console.log('Found admin with hash:', admin.password);

      // Generate a test hash with the same input to compare
      const salt = bcrypt.genSaltSync(10, 'a');
      const testHash = bcrypt.hashSync(password, salt);
      console.log('Generated test hash:', testHash);

      const passwordMatch = await bcrypt.compare(password, admin.password);
      console.log('Password match result:', passwordMatch);

      if (!passwordMatch) {
        console.log('Password verification failed');
        return res.status(401).json({ message: "Invalid credentials" });
      }

      req.session.adminUser = { id: admin.id, username: admin.username };
      console.log('Session after login:', req.session);

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

  // Beta signup endpoint
  app.post("/api/beta-signup", async (req, res) => {
    try {
      const { email, subscribe } = req.body;

      const existing = await db.query.betaSignups.findFirst({
        where: eq(betaSignups.email, email)
      });

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
      const signups = await db.query.betaSignups.findMany({
        orderBy: (betaSignups, { desc }) => [desc(betaSignups.createdAt)]
      });
      res.json(signups);
    } catch (error) {
      console.error("Error fetching beta signups:", error);
      res.status(500).json({ message: "Failed to fetch beta signups" });
    }
  });

  // Perplexity AI chat endpoint
  app.post("/api/chat", async (req, res) => {
    try {
      const response = await fetch("https://api.perplexity.ai/chat/completions", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${process.env.PERPLEXITY_API_KEY}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          model: "llama-3.1-sonar-small-128k-online",
          messages: req.body.messages,
          temperature: 0.2,
          max_tokens: 150,
          stream: false
        })
      });

      if (!response.ok) {
        throw new Error("Perplexity API request failed");
      }

      const data = await response.json();
      res.json(data);
    } catch (error) {
      console.error("Chat error:", error);
      res.status(500).json({ 
        message: "Failed to process chat request" 
      });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}