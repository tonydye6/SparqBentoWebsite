import { EventEmitter } from 'events';
import { db } from '@db';
import { betaSignups } from '@db/schema';
import { eq } from 'drizzle-orm';

// In-memory storage
const memoryStore = new Set<string>();
const eventEmitter = new EventEmitter();

// Type for signup data
interface SignupData {
  email: string;
  subscribed: boolean;
}

// Service to handle beta signups with fallback
export class BetaSignupService {
  private static instance: BetaSignupService;
  private isDbConnected: boolean = false;

  private constructor() {
    // Test database connection
    this.checkDatabaseConnection();
    
    // Periodically check database connection
    setInterval(() => this.checkDatabaseConnection(), 60000);
  }

  static getInstance(): BetaSignupService {
    if (!BetaSignupService.instance) {
      BetaSignupService.instance = new BetaSignupService();
    }
    return BetaSignupService.instance;
  }

  private async checkDatabaseConnection(): Promise<void> {
    try {
      await db.select().from(betaSignups).limit(1);
      this.isDbConnected = true;
    } catch (error) {
      this.isDbConnected = false;
      console.error('Database connection check failed:', error);
    }
  }

  async addSignup(data: SignupData): Promise<{ success: boolean; message: string; temporary: boolean }> {
    const { email, subscribed } = data;

    try {
      if (this.isDbConnected) {
        // Try database first
        const existing = await db.select()
          .from(betaSignups)
          .where(eq(betaSignups.email, email))
          .limit(1);

        if (existing.length > 0) {
          return {
            success: false,
            message: "Email already registered for beta",
            temporary: false
          };
        }

        await db.insert(betaSignups).values({
          email,
          subscribed: subscribed ?? false
        });

        return {
          success: true,
          message: "Successfully signed up for beta",
          temporary: false
        };
      } else {
        // Fallback to memory storage
        if (memoryStore.has(email)) {
          return {
            success: false,
            message: "Email already registered for beta",
            temporary: true
          };
        }

        memoryStore.add(email);
        eventEmitter.emit('signup', { email, subscribed });

        return {
          success: true,
          message: "Successfully signed up for beta (temporary storage)",
          temporary: true
        };
      }
    } catch (error) {
      console.error('Beta signup error:', error);
      
      // Final fallback - store in memory if database operation fails
      if (!memoryStore.has(email)) {
        memoryStore.add(email);
        eventEmitter.emit('signup', { email, subscribed });
      }

      return {
        success: true,
        message: "Successfully signed up for beta (temporary storage)",
        temporary: true
      };
    }
  }

  getSignupCount(): number {
    return memoryStore.size;
  }

  onSignup(callback: (data: SignupData) => void): void {
    eventEmitter.on('signup', callback);
  }
}
