import { db } from '../../config/db';
import { expedition, expeditionItem, warehouse, kurir, user } from '../../../drizzle/schema';
import { eq, and, desc } from 'drizzle-orm';

export class ExpeditionService {
  async getExpeditions(page: number = 1, limit: number = 10) {
    const offset = (page - 1) * limit;

    const expeditions = await db
      .select({
        expedition,
        warehouse,
        kurir,
        creator: user,
      })
      .from(expedition)
      .innerJoin(warehouse, eq(expedition.warehouse_id, warehouse.id))
      .leftJoin(kurir, eq(expedition.kurir_id, kurir.id))
      .innerJoin(user, eq(expedition.created_by, user.id))
      .orderBy(desc(expedition.created_at))
      .limit(limit)
      .offset(offset);

    return expeditions.map(exp => ({
      ...exp.expedition,
      warehouse: exp.warehouse,
      kurir: exp.kurir,
      creator: exp.creator,
    }));
  }

  async getExpeditionById(id: number) {
    const [foundExpedition] = await db
      .select({
        expedition,
        warehouse,
        kurir,
        creator: user,
      })
      .from(expedition)
      .innerJoin(warehouse, eq(expedition.warehouse_id, warehouse.id))
      .leftJoin(kurir, eq(expedition.kurir_id, kurir.id))
      .innerJoin(user, eq(expedition.created_by, user.id))
      .where(eq(expedition.id, id))
      .limit(1);

    if (!foundExpedition) {
      return null;
    }

    const items = await db
      .select()
      .from(expeditionItem)
      .where(eq(expeditionItem.expedition_id, id));

    return {
      ...foundExpedition.expedition,
      warehouse: foundExpedition.warehouse,
      kurir: foundExpedition.kurir,
      creator: foundExpedition.creator,
      items,
    };
  }

  async createExpedition(data: {
    warehouse_id: number;
    kurir_id?: number;
    notes?: string;
    delivery_ids: number[];
    created_by: number;
  }) {
    const expeditionCode = `EXP-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;

    await db.insert(expedition).values({
      expedition_code: expeditionCode,
      warehouse_id: data.warehouse_id,
      kurir_id: data.kurir_id,
      notes: data.notes,
      status: 'pending',
      created_by: data.created_by,
    });

    const [created] = await db
      .select()
      .from(expedition)
      .where(eq(expedition.expedition_code, expeditionCode))
      .limit(1);

    if (!created) {
      throw new Error('Failed to create expedition');
    }

    if (data.delivery_ids && data.delivery_ids.length > 0) {
      const itemsToInsert = data.delivery_ids.map(deliveryId => ({
        expedition_id: created.id,
        delivery_id: deliveryId,
      }));

      await db.insert(expeditionItem).values(itemsToInsert);
    }

    return created;
  }

  async updateExpeditionStatus(id: number, status: string, notes?: string) {
    await db
      .update(expedition)
      .set({
        status: status as any,
        notes,
      })
      .where(eq(expedition.id, id));

    return this.getExpeditionById(id);
  }

  async getExpeditionReport(warehouseId?: number, startDate?: string, endDate?: string) {
    const expeditions = await this.getExpeditions(1, 1000);

    let filtered = expeditions;

    if (warehouseId) {
      filtered = filtered.filter(exp => exp.warehouse_id === warehouseId);
    }

    if (startDate && endDate) {
      filtered = filtered.filter(exp => {
        const date = new Date(exp.created_at);
        return date >= new Date(startDate) && date <= new Date(endDate);
      });
    }

    return {
      total_expeditions: filtered.length,
      completed: filtered.filter(exp => exp.status === 'delivered').length,
      pending: filtered.filter(exp => exp.status === 'pending').length,
      in_progress: filtered.filter(exp => exp.status === 'processing' || exp.status === 'shipped').length,
      expeditions: filtered,
    };
  }
}

