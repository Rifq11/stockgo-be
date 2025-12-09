"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const db_1 = require("../../config/db");
const schema_1 = require("../../../drizzle/schema");
const drizzle_orm_1 = require("drizzle-orm");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jwt_util_1 = require("../../utils/jwt.util");
class AuthService {
    async login(email, password) {
        const [foundUser] = await db_1.db
            .select({
            id: schema_1.user.id,
            email: schema_1.user.email,
            full_name: schema_1.user.full_name,
            password: schema_1.user.password,
            role_id: schema_1.user.role_id,
            role: { id: schema_1.role.id, name: schema_1.role.name },
            is_active: schema_1.user.is_active,
        })
            .from(schema_1.user)
            .innerJoin(schema_1.role, (0, drizzle_orm_1.eq)(schema_1.user.role_id, schema_1.role.id))
            .where((0, drizzle_orm_1.eq)(schema_1.user.email, email))
            .limit(1);
        if (!foundUser) {
            throw new Error('Invalid email or password');
        }
        if (!foundUser.is_active) {
            throw new Error('Account is inactive');
        }
        const isPasswordValid = await bcryptjs_1.default.compare(password, foundUser.password);
        if (!isPasswordValid) {
            throw new Error('Invalid email or password');
        }
        const token = (0, jwt_util_1.generateToken)({
            id: foundUser.id,
            email: foundUser.email,
            role_id: foundUser.role_id,
            role: foundUser.role.name,
            is_active: foundUser.is_active,
        });
        return {
            id: foundUser.id,
            email: foundUser.email,
            full_name: foundUser.full_name,
            role_id: foundUser.role_id,
            role: foundUser.role.name,
            is_active: foundUser.is_active,
            token,
        };
    }
    async register(data) {
        const [existingUser] = await db_1.db
            .select()
            .from(schema_1.user)
            .where((0, drizzle_orm_1.eq)(schema_1.user.email, data.email))
            .limit(1);
        if (existingUser) {
            throw new Error('Email already registered');
        }
        const hashedPassword = await bcryptjs_1.default.hash(data.password, 10);
        let finalRoleId = data.role_id;
        if (!finalRoleId) {
            const [kurirRole] = await db_1.db
                .select()
                .from(schema_1.role)
                .where((0, drizzle_orm_1.eq)(schema_1.role.name, 'kurir'))
                .limit(1);
            if (!kurirRole) {
                throw new Error('Default role (kurir) not found. Please contact administrator.');
            }
            finalRoleId = kurirRole.id;
        }
        await db_1.db.insert(schema_1.user).values({
            full_name: data.full_name,
            email: data.email,
            password: hashedPassword,
            phone: data.phone,
            role_id: finalRoleId,
            is_active: true,
        });
        const [newUser] = await db_1.db
            .select()
            .from(schema_1.user)
            .where((0, drizzle_orm_1.eq)(schema_1.user.email, data.email))
            .limit(1);
        if (!newUser) {
            throw new Error('Failed to create user');
        }
        const token = (0, jwt_util_1.generateToken)({
            id: newUser.id,
            email: newUser.email,
            role_id: newUser.role_id,
            is_active: newUser.is_active,
        });
        return {
            id: newUser.id,
            email: newUser.email,
            full_name: newUser.full_name,
            role_id: newUser.role_id,
            is_active: newUser.is_active,
            token,
        };
    }
    async getProfile(userId) {
        const [userProfile] = await db_1.db
            .select({
            id: schema_1.user.id,
            full_name: schema_1.user.full_name,
            email: schema_1.user.email,
            phone: schema_1.user.phone,
            role_id: schema_1.user.role_id,
            role: { id: schema_1.role.id, name: schema_1.role.name, description: schema_1.role.description },
            is_active: schema_1.user.is_active,
            created_at: schema_1.user.created_at,
        })
            .from(schema_1.user)
            .innerJoin(schema_1.role, (0, drizzle_orm_1.eq)(schema_1.user.role_id, schema_1.role.id))
            .where((0, drizzle_orm_1.eq)(schema_1.user.id, userId))
            .limit(1);
        if (!userProfile) {
            throw new Error('User not found');
        }
        return userProfile;
    }
    async updateProfile(userId, payload) {
        const [existing] = await db_1.db.select().from(schema_1.user).where((0, drizzle_orm_1.eq)(schema_1.user.id, userId)).limit(1);
        if (!existing) {
            throw new Error('User not found');
        }
        const [emailOwner] = await db_1.db
            .select({ id: schema_1.user.id })
            .from(schema_1.user)
            .where((0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(schema_1.user.email, payload.email), (0, drizzle_orm_1.eq)(schema_1.user.is_active, true)));
        if (emailOwner && emailOwner.id !== userId) {
            throw new Error('Email already in use');
        }
        await db_1.db
            .update(schema_1.user)
            .set({
            full_name: payload.full_name,
            email: payload.email,
            phone: payload.phone,
        })
            .where((0, drizzle_orm_1.eq)(schema_1.user.id, userId));
        return this.getProfile(userId);
    }
    async changePassword(userId, oldPassword, newPassword) {
        const [existingUser] = await db_1.db
            .select({
            id: schema_1.user.id,
            password: schema_1.user.password,
        })
            .from(schema_1.user)
            .where((0, drizzle_orm_1.eq)(schema_1.user.id, userId))
            .limit(1);
        if (!existingUser) {
            throw new Error('User not found');
        }
        const isPasswordValid = await bcryptjs_1.default.compare(oldPassword, existingUser.password);
        if (!isPasswordValid) {
            throw new Error('Current password is incorrect');
        }
        const hashedPassword = await bcryptjs_1.default.hash(newPassword, 10);
        await db_1.db
            .update(schema_1.user)
            .set({
            password: hashedPassword,
        })
            .where((0, drizzle_orm_1.eq)(schema_1.user.id, userId));
        return { success: true, message: 'Password changed successfully' };
    }
}
exports.AuthService = AuthService;
//# sourceMappingURL=auth.service.js.map