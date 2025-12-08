import { Response } from 'express';
import { AuthRequest } from '../../middleware/auth.middleware';
import { sendSuccess, sendError } from '../../utils/response.util';
import { AuthService } from './auth.service';

const authService = new AuthService();

export class AuthController {
  async login(req: AuthRequest, res: Response) {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        return sendError(res, 'Email and password are required', 400);
      }

      const userData = await authService.login(email, password);
      return sendSuccess(res, 'Login successful', userData);
    } catch (error: any) {
      console.error('Login error:', error);
      return sendError(res, error.message || 'Login failed', 401);
    }
  }

  async register(req: AuthRequest, res: Response) {
    try {
      const { full_name, email, password, phone, role_id } = req.body;

      if (!full_name || !email || !password) {
        return sendError(res, 'Full name, email, and password are required', 400);
      }

      const userData = await authService.register({
        full_name,
        email,
        password,
        phone,
        role_id,
      });

      return sendSuccess(res, 'Registration successful', userData, 201);
    } catch (error: any) {
      console.error('Registration error:', error);
      return sendError(res, error.message || 'Registration failed', 409);
    }
  }

  async logout(req: AuthRequest, res: Response) {
    try {
      return sendSuccess(res, 'Logout successful');
    } catch (error: any) {
      return sendError(res, 'Logout failed', 500, error.message);
    }
  }

  async getProfile(req: AuthRequest, res: Response) {
    try {
      const userId = req.user?.id;

      if (!userId) {
        return sendError(res, 'User ID not found', 401);
      }

      const userProfile = await authService.getProfile(userId);
      return sendSuccess(res, 'Profile retrieved successfully', userProfile);
    } catch (error: any) {
      return sendError(res, error.message || 'Failed to get profile', 404);
    }
  }

  async updateProfile(req: AuthRequest, res: Response) {
    try {
      const userId = req.user?.id;
      if (!userId) {
        return sendError(res, 'User ID not found', 401);
      }

      const { full_name, email, phone } = req.body;
      if (!full_name || !email) {
        return sendError(res, 'Full name and email are required', 400);
      }

      const updatedProfile = await authService.updateProfile(userId, {
        full_name,
        email,
        phone,
      });

      return sendSuccess(res, 'Profile updated successfully', updatedProfile);
    } catch (error: any) {
      console.error('Update profile error:', error);
      return sendError(res, error.message || 'Failed to update profile', 400);
    }
  }
}
