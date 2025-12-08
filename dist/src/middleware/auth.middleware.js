"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authorize = exports.authenticate = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const getJwtSecret = () => {
    return process.env.JWT_SECRET || 'stockgo-default-jwt-secret-key-2024-development-only';
};
const authenticate = async (req, res, next) => {
    try {
        const token = req.headers.authorization?.split(' ')[1];
        if (!token) {
            return res.status(401).json({ error: 'Access token required' });
        }
        const decoded = jsonwebtoken_1.default.verify(token, getJwtSecret());
        req.user = {
            id: decoded.id,
            email: decoded.email,
            role_id: decoded.role_id,
            role: decoded.role,
            is_active: decoded.is_active,
        };
        return next();
    }
    catch (error) {
        return res.status(401).json({ error: 'Invalid or expired token' });
    }
};
exports.authenticate = authenticate;
const authorize = (...allowedRoles) => {
    return async (req, res, next) => {
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
        }
        catch (error) {
            return res.status(500).json({ error: 'Authorization failed' });
        }
    };
};
exports.authorize = authorize;
//# sourceMappingURL=auth.middleware.js.map