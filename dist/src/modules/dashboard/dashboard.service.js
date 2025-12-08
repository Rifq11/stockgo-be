"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DashboardService = void 0;
const db_1 = require("../../config/db");
const schema_1 = require("../../../drizzle/schema");
const drizzle_orm_1 = require("drizzle-orm");
class DashboardService {
    async getDashboardStats(warehouseId, startDate, endDate) {
        let conditions = [];
        if (warehouseId) {
            conditions.push((0, drizzle_orm_1.eq)(schema_1.delivery.warehouse_id, warehouseId));
        }
        if (startDate && endDate) {
            conditions.push((0, drizzle_orm_1.gte)(schema_1.delivery.created_at, new Date(startDate)));
            conditions.push((0, drizzle_orm_1.lte)(schema_1.delivery.created_at, new Date(endDate)));
        }
        const whereClause = conditions.length > 0 ? (0, drizzle_orm_1.and)(...conditions) : undefined;
        const [{ total } = { total: 0 }] = await db_1.db
            .select({ total: (0, drizzle_orm_1.sql) `COUNT(*)` })
            .from(schema_1.delivery)
            .where(whereClause);
        const statusStats = await db_1.db
            .select({
            status: schema_1.delivery.status,
            count: schema_1.delivery.id,
        })
            .from(schema_1.delivery)
            .where(whereClause)
            .groupBy(schema_1.delivery.status);
        const recentDeliveries = await db_1.db
            .select()
            .from(schema_1.delivery)
            .where(whereClause)
            .orderBy((0, drizzle_orm_1.desc)(schema_1.delivery.created_at))
            .limit(5);
        return {
            total_deliveries: total,
            status_distribution: statusStats,
            recent_deliveries: recentDeliveries,
        };
    }
    async getDeliveryAnalytics(warehouseId, startDate, endDate) {
        let conditions = [];
        if (warehouseId) {
            conditions.push((0, drizzle_orm_1.eq)(schema_1.delivery.warehouse_id, warehouseId));
        }
        if (startDate && endDate) {
            conditions.push((0, drizzle_orm_1.gte)(schema_1.delivery.created_at, new Date(startDate)));
            conditions.push((0, drizzle_orm_1.lte)(schema_1.delivery.created_at, new Date(endDate)));
        }
        const whereClause = conditions.length > 0 ? (0, drizzle_orm_1.and)(...conditions) : undefined;
        const dailyStats = await db_1.db
            .select({
            date: (0, drizzle_orm_1.sql) `DATE(${schema_1.delivery.created_at})`,
            count: (0, drizzle_orm_1.sql) `COUNT(*)`,
        })
            .from(schema_1.delivery)
            .where(whereClause)
            .groupBy((0, drizzle_orm_1.sql) `DATE(${schema_1.delivery.created_at})`)
            .orderBy((0, drizzle_orm_1.sql) `DATE(${schema_1.delivery.created_at})`);
        return { daily_stats: dailyStats };
    }
    async getKurirPerformance(startDate, endDate) {
        let conditions = [];
        if (startDate && endDate) {
            conditions.push((0, drizzle_orm_1.gte)(schema_1.delivery.created_at, new Date(startDate)));
            conditions.push((0, drizzle_orm_1.lte)(schema_1.delivery.created_at, new Date(endDate)));
        }
        const whereClause = conditions.length > 0 ? (0, drizzle_orm_1.and)(...conditions) : undefined;
        const kurirStats = await db_1.db
            .select({
            kurir_id: schema_1.delivery.kurir_id,
            total_deliveries: (0, drizzle_orm_1.sql) `COUNT(*)`,
            completed_deliveries: (0, drizzle_orm_1.sql) `SUM(CASE WHEN ${schema_1.delivery.status} = 'delivered' THEN 1 ELSE 0 END)`,
        })
            .from(schema_1.delivery)
            .where(whereClause)
            .groupBy(schema_1.delivery.kurir_id);
        return { kurir_stats: kurirStats };
    }
    async getWarehouseStats() {
        const warehouses = await db_1.db.select().from(schema_1.warehouse).where((0, drizzle_orm_1.eq)(schema_1.warehouse.is_active, true));
        const warehouseStats = await Promise.all(warehouses.map(async (wh) => {
            const [{ total } = { total: 0 }] = await db_1.db
                .select({ total: (0, drizzle_orm_1.sql) `COUNT(*)` })
                .from(schema_1.delivery)
                .where((0, drizzle_orm_1.eq)(schema_1.delivery.warehouse_id, wh.id));
            return {
                warehouse: wh,
                total_deliveries: total,
            };
        }));
        return { warehouses: warehouseStats };
    }
}
exports.DashboardService = DashboardService;
//# sourceMappingURL=dashboard.service.js.map