import { db } from '../../config/db';
import { user, role } from '../../../drizzle/schema';
import { eq, and } from 'drizzle-orm';
import bcrypt from 'bcryptjs';
import { generateToken } from '../../utils/jwt.util';

export class AuthService {
  async login(email: string, password: string) {
    const [foundUser] = await db
      .select({
        id: user.id,
        email: user.email,
        full_name: user.full_name,
        password: user.password,
        role_id: user.role_id,
        role: { id: role.id, name: role.name },
        is_active: user.is_active,
      })
      .from(user)
      .innerJoin(role, eq(user.role_id, role.id))
      .where(eq(user.email, email))
      .limit(1);

    if (!foundUser) {
      throw new Error('Invalid email or password');
    }

    if (!foundUser.is_active) {
      throw new Error('Account is inactive');
    }

    const isPasswordValid = await bcrypt.compare(password, foundUser.password);
    if (!isPasswordValid) {
      throw new Error('Invalid email or password');
    }

    const token = generateToken({
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

  async register(data: {
    full_name: string;
    email: string;
    password: string;
    phone?: string;
    role_id?: number;
  }) {
    const [existingUser] = await db
      .select()
      .from(user)
      .where(eq(user.email, data.email))
      .limit(1);

    if (existingUser) {
      throw new Error('Email already registered');
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(data.password, 10);

    // Get default role (kurir) if role_id not provided
    let finalRoleId = data.role_id;
    if (!finalRoleId) {
      const [kurirRole] = await db
        .select()
        .from(role)
        .where(eq(role.name, 'kurir'))
        .limit(1);
      
      if (!kurirRole) {
        throw new Error('Default role (kurir) not found. Please contact administrator.');
      }
      
      finalRoleId = kurirRole.id;
    }

    await db.insert(user).values({
      full_name: data.full_name,
      email: data.email,
      password: hashedPassword,
      phone: data.phone,
      role_id: finalRoleId,
      is_active: true,
    });

    // Get the created user
    const [newUser] = await db
      .select()
      .from(user)
      .where(eq(user.email, data.email))
      .limit(1);

    if (!newUser) {
      throw new Error('Failed to create user');
    }

    const token = generateToken({
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

  async getProfile(userId: number) {
    const [userProfile] = await db
      .select({
        id: user.id,
        full_name: user.full_name,
        email: user.email,
        phone: user.phone,
        role_id: user.role_id,
        role: { id: role.id, name: role.name, description: role.description },
        is_active: user.is_active,
        created_at: user.created_at,
      })
      .from(user)
      .innerJoin(role, eq(user.role_id, role.id))
      .where(eq(user.id, userId))
      .limit(1);

    if (!userProfile) {
      throw new Error('User not found');
    }

    return userProfile;
  }

  async updateProfile(
    userId: number,
    payload: { full_name: string; email: string; phone?: string }
  ) {
    const [existing] = await db.select().from(user).where(eq(user.id, userId)).limit(1);
    if (!existing) {
      throw new Error('User not found');
    }

    const [emailOwner] = await db
      .select({ id: user.id })
      .from(user)
      .where(and(eq(user.email, payload.email), eq(user.is_active, true)));

    if (emailOwner && emailOwner.id !== userId) {
      throw new Error('Email already in use');
    }

    await db
      .update(user)
      .set({
        full_name: payload.full_name,
        email: payload.email,
        phone: payload.phone,
      })
      .where(eq(user.id, userId));

    return this.getProfile(userId);
  }
}

