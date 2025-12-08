import { db } from '../../config/db';
import { kurir, user } from '../../../drizzle/schema';
import { eq, desc } from 'drizzle-orm';

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
    const kurirData = await this.getKurirById(id);

    if (!kurirData) {
      return null;
    }

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
    // validate rating range (0-5)
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

  async createKurir(userId: number, data: {
    license_number?: string;
    vehicle_type?: string;
    vehicle_plate?: string;
    current_location?: string;
    max_capacity?: string;
  }) {
    // generate employee_id
    const lastKurir = await db
      .select()
      .from(kurir)
      .orderBy(desc(kurir.id))
      .limit(1);

    let nextNumber = 1;
    if (lastKurir.length > 0 && lastKurir[0]) {
      const lastEmployeeId = lastKurir[0].employee_id;
      // format KUR-001
      if (lastEmployeeId && (lastEmployeeId.startsWith('KUR-') || lastEmployeeId.startsWith('KUR_'))) {
        const numStr = lastEmployeeId.substring(4);
        const parsed = parseInt(numStr);
        if (!isNaN(parsed)) {
          nextNumber = parsed + 1;
        }
      }
    }

    const employeeId = `KUR-${nextNumber.toString().padStart(3, '0')}`;

    const [newKurir] = await db
      .insert(kurir)
      .values({
        user_id: userId,
        employee_id: employeeId,
        license_number: data.license_number || null,
        vehicle_type: data.vehicle_type || null,
        vehicle_plate: data.vehicle_plate || null,
        current_location: data.current_location || null,
        max_capacity: data.max_capacity || null,
        status: 'available',
      })
      .$returningId();

    if (!newKurir || !newKurir.id) {
      throw new Error('Failed to create kurir profile');
    }

    return this.getKurirById(newKurir.id);
  }

  async updateKurir(id: number, data: {
    license_number?: string;
    vehicle_type?: string;
    vehicle_plate?: string;
    current_location?: string;
    max_capacity?: string;
  }) {
    await db
      .update(kurir)
      .set({
        ...(data.license_number !== undefined && { license_number: data.license_number }),
        ...(data.vehicle_type !== undefined && { vehicle_type: data.vehicle_type }),
        ...(data.vehicle_plate !== undefined && { vehicle_plate: data.vehicle_plate }),
        ...(data.current_location !== undefined && { current_location: data.current_location }),
        ...(data.max_capacity !== undefined && { max_capacity: data.max_capacity }),
      })
      .where(eq(kurir.id, id));

    return this.getKurirById(id);
  }
}

