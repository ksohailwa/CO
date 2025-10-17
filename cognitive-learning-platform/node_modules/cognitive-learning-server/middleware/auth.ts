// --- START OF FILE server/middleware/auth.ts ---
import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { IJwtPayload } from '../../shared/types';

// Add a custom property 'user' to the Express Request interface
declare global {
  namespace Express {
    interface Request {
      user?: IJwtPayload;
    }
  }
}

const JWT_SECRET = process.env.JWT_SECRET!;

export const requireAuth = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Authorization token is required.' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as IJwtPayload;
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Invalid or expired token.' });
  }
};

// Middleware to check for a specific role
export const requireRole = (role: 'teacher' | 'participant') => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (req.user?.role !== role) {
      return res.status(403).json({ message: 'Forbidden: Insufficient permissions.' });
    }
    next();
  };
};
// --- END OF FILE server/middleware/auth.ts ---