import { db } from '../../config/db';
import { kurir, user } from '../../../drizzle/schema';
import { eq } from 'drizzle-orm';

export class KurirService {
  async getKurirs(page: number = 1, limit: number = 10) {
    const offset = (page - 1) * limit;

    const kurirs = await db
      .select({
        kurir,
        user,
      })
      .from(kurir)
      .innerJoin(user, eq(kurir.user_id, user.id))
      .limit(limit)
      .offset(offset);

    return kurirs.map(k => ({
      ...k.kurir,
      user: k.user,
    }));
  }

  async getKurirById(id: number) {
    const [foundKurir] = await db
      .select({
        kurir,
        user,
      })
      .from(kurir)
      .innerJoin(user, eq(kurir.user_id, user.id))
      .where(eq(kurir.id, id))
      .limit(1);

    if (!foundKurir) {
      return null;
    }

    return {
      ...foundKurir.kurir,
      user: foundKurir.user,
    };
  }

  async updateKurirStatus(id: number, status: string, location?: string) {
    await db
      .update(kurir)
      .set({
        status: status as any,
        ...(location && { current_location: location }),
      })
      .where(eq(kurir.id, id));

    return this.getKurirById(id);
  }

  async getKurirPerformance(id: number, startDate?: string, endDate?: string) {
    // Get kurir data
    const kurirData = await this.getKurirById(id);

    if (!kurirData) {
      return null;
    }

    // Calculate performance (dummy data - implement real query)
    return {
      kurir: kurirData,
      performance: {
        total_deliveries: 0,
        completed_deliveries: 0,
        rating: kurirData.rating,
        status: kurirData.status,
      },
    };
  }

  async updateKurirRating(id: number, rating: number) {
    // Validate rating range (0-5)
    if (rating < 0 || rating > 5) {
      throw new Error('Rating must be between 0 and 5');
    }

    await db
      .update(kurir)
      .set({
        rating: rating.toString(),
      })
      .where(eq(kurir.id, id));

    return this.getKurirById(id);
  }

  async getKurirByUserId(userId: number) {
    const [foundKurir] = await db
      .select({
        kurir,
        user,
      })
      .from(kurir)
      .innerJoin(user, eq(kurir.user_id, user.id))
      .where(eq(kurir.user_id, userId))
      .limit(1);

    if (!foundKurir) {
      return null;
    }

    return {
      ...foundKurir.kurir,
      user: foundKurir.user,
    };
  }

  async createOrUpdateKurirProfile(
    userId: number,
    data: {
      employee_id: string;
      license_number?: string;
      vehicle_type?: string;
      vehicle_plate?: string;
      max_capacity?: number;
    }
  ) {
    // Check if kurir already exists
    const existingKurir = await this.getKurirByUserId(userId);

    if (existingKurir) {
      // Update existing kurir
      await db
        .update(kurir)
        .set({
          employee_id: data.employee_id,
          license_number: data.license_number,
          vehicle_type: data.vehicle_type,
          vehicle_plate: data.vehicle_plate,
          max_capacity: data.max_capacity?.toString(),
        })
        .where(eq(kurir.user_id, userId));

      return this.getKurirByUserId(userId);
    } else {
      // Create new kurir
      // MySQL doesn't support .returning(), so we insert and then query
      await db
        .insert(kurir)
        .values({
          user_id: userId,
          employee_id: data.employee_id,
          license_number: data.license_number,
          vehicle_type: data.vehicle_type,
          vehicle_plate: data.vehicle_plate,
          max_capacity: data.max_capacity?.toString(),
          status: 'available' as any,
        });

      // Get the newly created kurir by user_id
      return this.getKurirByUserId(userId);
    }
  }
}

