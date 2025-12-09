"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthController = void 0;
const response_util_1 = require("../../utils/response.util");
const auth_service_1 = require("./auth.service");
const authService = new auth_service_1.AuthService();
class AuthController {
    async login(req, res) {
        try {
            const { email, password } = req.body;
            if (!email || !password) {
                return (0, response_util_1.sendError)(res, 'Email and password are required', 400);
            }
            const userData = await authService.login(email, password);
            return (0, response_util_1.sendSuccess)(res, 'Login successful', userData);
        }
        catch (error) {
            console.error('Login error:', error);
            return (0, response_util_1.sendError)(res, error.message || 'Login failed', 401);
        }
    }
    async register(req, res) {
        try {
            const { full_name, email, password, phone, role_id } = req.body;
            if (!full_name || !email || !password) {
                return (0, response_util_1.sendError)(res, 'Full name, email, and password are required', 400);
            }
            const userData = await authService.register({
                full_name,
                email,
                password,
                phone,
                role_id,
            });
            return (0, response_util_1.sendSuccess)(res, 'Registration successful', userData, 201);
        }
        catch (error) {
            console.error('Registration error:', error);
            return (0, response_util_1.sendError)(res, error.message || 'Registration failed', 409);
        }
    }
    async logout(req, res) {
        try {
            return (0, response_util_1.sendSuccess)(res, 'Logout successful');
        }
        catch (error) {
            return (0, response_util_1.sendError)(res, 'Logout failed', 500, error.message);
        }
    }
    async getProfile(req, res) {
        try {
            const userId = req.user?.id;
            if (!userId) {
                return (0, response_util_1.sendError)(res, 'User ID not found', 401);
            }
            const userProfile = await authService.getProfile(userId);
            return (0, response_util_1.sendSuccess)(res, 'Profile retrieved successfully', userProfile);
        }
        catch (error) {
            return (0, response_util_1.sendError)(res, error.message || 'Failed to get profile', 404);
        }
    }
    async updateProfile(req, res) {
        try {
            const userId = req.user?.id;
            if (!userId) {
                return (0, response_util_1.sendError)(res, 'User ID not found', 401);
            }
            const { full_name, email, phone } = req.body;
            if (!full_name || !email) {
                return (0, response_util_1.sendError)(res, 'Full name and email are required', 400);
            }
            const updatedProfile = await authService.updateProfile(userId, {
                full_name,
                email,
                phone,
            });
            return (0, response_util_1.sendSuccess)(res, 'Profile updated successfully', updatedProfile);
        }
        catch (error) {
            console.error('Update profile error:', error);
            return (0, response_util_1.sendError)(res, error.message || 'Failed to update profile', 400);
        }
    }
    async changePassword(req, res) {
        try {
            const userId = req.user?.id;
            if (!userId) {
                return (0, response_util_1.sendError)(res, 'User ID not found', 401);
            }
            const { old_password, new_password } = req.body;
            if (!old_password || !new_password) {
                return (0, response_util_1.sendError)(res, 'Old password and new password are required', 400);
            }
            if (new_password.length < 6) {
                return (0, response_util_1.sendError)(res, 'New password must be at least 6 characters', 400);
            }
            const result = await authService.changePassword(userId, old_password, new_password);
            return (0, response_util_1.sendSuccess)(res, 'Password changed successfully', result);
        }
        catch (error) {
            console.error('Change password error:', error);
            return (0, response_util_1.sendError)(res, error.message || 'Failed to change password', 400);
        }
    }
}
exports.AuthController = AuthController;
//# sourceMappingURL=auth.controller.js.map