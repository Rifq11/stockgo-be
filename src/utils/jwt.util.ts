import jwt from 'jsonwebtoken';

export interface TokenPayload {
  id: number;
  email: string;
  role_id: number;
  role?: string;
  is_active: boolean;
}

const getJwtSecret = (): string => {
  return process.env.JWT_SECRET || 'stockgo-default-jwt-secret-key-2024-development-only';
};

export const generateToken = (payload: TokenPayload): string => {
  const secret = getJwtSecret();
  const expiresIn = process.env.JWT_EXPIRES_IN || '7d';
  
  return jwt.sign(payload, secret, { expiresIn } as jwt.SignOptions);
};

export const verifyToken = (token: string): TokenPayload => {
  const secret = getJwtSecret();
  return jwt.verify(token, secret) as TokenPayload;
};

