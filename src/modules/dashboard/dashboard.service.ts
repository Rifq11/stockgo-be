import { db } from '../../config/db';
import { delivery, warehouse, kurir } from '../../../drizzle/schema';
import { eq, and, desc, gte, lte, sql } from 'drizzle-orm';

export class DashboardService {
  async getDashboardStats(warehouseId?: number, startDate?: string, endDate?: string) {
    let conditions: any[] = [];

    if (warehouseId) {
      conditions.push(eq(delivery.warehouse_id, warehouseId));
    }

    if (startDate && endDate) {
      conditions.push(gte(delivery.created_at, new Date(startDate)));
      conditions.push(lte(delivery.created_at, new Date(endDate)));
    }

    const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

    const [{ total } = { total: 0 }] = await db
      .select({ total: sql<number>`COUNT(*)` })
      .from(delivery)
      .where(whereClause);

    const statusStats = await db
      .select({
        status: delivery.status,
        count: delivery.id,
      })
      .from(delivery)
      .where(whereClause)
      .groupBy(delivery.status);

    const recentDeliveries = await db
      .select()
      .from(delivery)
      .where(whereClause)
      .orderBy(desc(delivery.created_at))
      .limit(5);

    return {
      total_deliveries: total,
      status_distribution: statusStats,
      recent_deliveries: recentDeliveries,
    };
  }

  async getDeliveryAnalytics(warehouseId?: number, startDate?: string, endDate?: string) {
    let conditions: any[] = [];

    if (warehouseId) {
      conditions.push(eq(delivery.warehouse_id, warehouseId));
    }

    if (startDate && endDate) {
      conditions.push(gte(delivery.created_at, new Date(startDate)));
      conditions.push(lte(delivery.created_at, new Date(endDate)));
    }

    const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

    // daily delivery count
    const dailyStats = await db
      .select({
        date: sql<string>`DATE(${delivery.created_at})`,
        count: sql<number>`COUNT(*)`,
      })
      .from(delivery)
      .where(whereClause)
      .groupBy(sql`DATE(${delivery.created_at})`)
      .orderBy(sql`DATE(${delivery.created_at})`);

    return { daily_stats: dailyStats };
  }

  async getKurirPerformance(startDate?: string, endDate?: string) {
    let conditions: any[] = [];

    if (startDate && endDate) {
      conditions.push(gte(delivery.created_at, new Date(startDate)));
      conditions.push(lte(delivery.created_at, new Date(endDate)));
    }

    const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

    const kurirStats = await db
      .select({
        kurir_id: delivery.kurir_id,
        total_deliveries: sql<number>`COUNT(*)`,
        completed_deliveries: sql<number>`SUM(CASE WHEN ${delivery.status} = 'delivered' THEN 1 ELSE 0 END)`,
      })
      .from(delivery)
      .where(whereClause)
      .groupBy(delivery.kurir_id);

    return { kurir_stats: kurirStats };
  }

  async getWarehouseStats() {
    const warehouses = await db.select().from(warehouse).where(eq(warehouse.is_active, true));

    const warehouseStats = await Promise.all(
      warehouses.map(async (wh) => {
        const [{ total } = { total: 0 }] = await db
          .select({ total: sql<number>`COUNT(*)` })
          .from(delivery)
          .where(eq(delivery.warehouse_id, wh.id));

        return {
          warehouse: wh,
          total_deliveries: total,
        };
      })
    );

    return { warehouses: warehouseStats };
  }
}

