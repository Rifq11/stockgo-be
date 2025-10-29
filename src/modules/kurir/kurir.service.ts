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
}

