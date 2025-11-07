import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

export interface AuthRequest extends Request {
  user?: {
    id: number;
    email: string;
    role_id: number;
    role?: string;
    is_active: boolean;
  };
}

const getJwtSecret = (): string => {
  return process.env.JWT_SECRET || 'stockgo-default-jwt-secret-key-2024-development-only';
};

export const authenticate = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
      return res.status(401).json({ error: 'Access token required' });
    }

    const decoded = jwt.verify(token, getJwtSecret()) as any;
    req.user = {
      id: decoded.id,
      email: decoded.email,
      role_id: decoded.role_id,
      role: decoded.role,
      is_active: decoded.is_active,
    };

    return next();
  } catch (error) {
    return res.status(401).json({ error: 'Invalid or expired token' });
  }
};

export const authorize = (...allowedRoles: string[]) => {
  return async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      if (!req.user) {
        return res.status(401).json({ error: 'Authentication required' });
      }

      if (!req.user.is_active) {
        return res.status(403).json({ error: 'Account is inactive' });
      }

      if (!allowedRoles.includes(req.user.role || '')) {
        return res.status(403).json({ error: 'Insufficient permissions' });
      }

      return next();
    } catch (error) {
      return res.status(500).json({ error: 'Authorization failed' });
    }
  };
};

