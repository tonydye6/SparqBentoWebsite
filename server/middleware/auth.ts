import type { Request, Response, NextFunction } from "express";

export function requireAdmin(req: Request, res: Response, next: NextFunction) {
  console.log('Session:', req.session); // Debug log
  if (!req.session?.adminUser) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  next();
}

export function adminSessionMiddleware(req: Request, res: Response, next: NextFunction) {
  console.log('Admin Session Middleware - Session:', req.session); // Debug log
  if (req.session?.adminUser) {
    res.locals.adminUser = req.session.adminUser;
  }
  next();
}