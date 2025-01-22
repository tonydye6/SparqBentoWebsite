import type { Express } from "express";
import { createServer, type Server } from "http";
import { db } from "@db";
import { betaSignups } from "@db/schema";
import { eq } from "drizzle-orm";

export function registerRoutes(app: Express): Server {
  // Beta signup endpoint
  app.post("/api/beta-signup", async (req, res) => {
    try {
      const { email, subscribe } = req.body;
      
      // Check if email already exists
      const existing = await db.query.betaSignups.findFirst({
        where: eq(betaSignups.email, email)
      });
      
      if (existing) {
        return res.status(400).json({ 
          message: "Email already registered for beta" 
        });
      }
      
      // Insert new signup
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
