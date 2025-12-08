"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ExpeditionService = void 0;
const db_1 = require("../../config/db");
const schema_1 = require("../../../drizzle/schema");
const drizzle_orm_1 = require("drizzle-orm");
class ExpeditionService {
    async getExpeditions(page = 1, limit = 10) {
        const offset = (page - 1) * limit;
        const expeditions = await db_1.db
            .select({
            expedition: schema_1.expedition,
            warehouse: schema_1.warehouse,
            kurir: schema_1.kurir,
            creator: schema_1.user,
        })
            .from(schema_1.expedition)
            .innerJoin(schema_1.warehouse, (0, drizzle_orm_1.eq)(schema_1.expedition.warehouse_id, schema_1.warehouse.id))
            .leftJoin(schema_1.kurir, (0, drizzle_orm_1.eq)(schema_1.expedition.kurir_id, schema_1.kurir.id))
            .innerJoin(schema_1.user, (0, drizzle_orm_1.eq)(schema_1.expedition.created_by, schema_1.user.id))
            .orderBy((0, drizzle_orm_1.desc)(schema_1.expedition.created_at))
            .limit(limit)
            .offset(offset);
        return expeditions.map(exp => ({
            ...exp.expedition,
            warehouse: exp.warehouse,
            kurir: exp.kurir,
            creator: exp.creator,
        }));
    }
    async getExpeditionById(id) {
        const [foundExpedition] = await db_1.db
            .select({
            expedition: schema_1.expedition,
            warehouse: schema_1.warehouse,
            kurir: schema_1.kurir,
            creator: schema_1.user,
        })
            .from(schema_1.expedition)
            .innerJoin(schema_1.warehouse, (0, drizzle_orm_1.eq)(schema_1.expedition.warehouse_id, schema_1.warehouse.id))
            .leftJoin(schema_1.kurir, (0, drizzle_orm_1.eq)(schema_1.expedition.kurir_id, schema_1.kurir.id))
            .innerJoin(schema_1.user, (0, drizzle_orm_1.eq)(schema_1.expedition.created_by, schema_1.user.id))
            .where((0, drizzle_orm_1.eq)(schema_1.expedition.id, id))
            .limit(1);
        if (!foundExpedition) {
            return null;
        }
        const items = await db_1.db
            .select()
            .from(schema_1.expeditionItem)
            .where((0, drizzle_orm_1.eq)(schema_1.expeditionItem.expedition_id, id));
        return {
            ...foundExpedition.expedition,
            warehouse: foundExpedition.warehouse,
            kurir: foundExpedition.kurir,
            creator: foundExpedition.creator,
            items,
        };
    }
    async createExpedition(data) {
        const expeditionCode = `EXP-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
        await db_1.db.insert(schema_1.expedition).values({
            expedition_code: expeditionCode,
            warehouse_id: data.warehouse_id,
            kurir_id: data.kurir_id,
            notes: data.notes,
            status: 'pending',
            created_by: data.created_by,
        });
        const [created] = await db_1.db
            .select()
            .from(schema_1.expedition)
            .where((0, drizzle_orm_1.eq)(schema_1.expedition.expedition_code, expeditionCode))
            .limit(1);
        if (!created) {
            throw new Error('Failed to create expedition');
        }
        if (data.delivery_ids && data.delivery_ids.length > 0) {
            const itemsToInsert = data.delivery_ids.map(deliveryId => ({
                expedition_id: created.id,
                delivery_id: deliveryId,
            }));
            await db_1.db.insert(schema_1.expeditionItem).values(itemsToInsert);
        }
        return created;
    }
    async updateExpeditionStatus(id, status, notes) {
        await db_1.db
            .update(schema_1.expedition)
            .set({
            status: status,
            notes,
        })
            .where((0, drizzle_orm_1.eq)(schema_1.expedition.id, id));
        return this.getExpeditionById(id);
    }
    async getExpeditionReport(warehouseId, startDate, endDate) {
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
exports.ExpeditionService = ExpeditionService;
//# sourceMappingURL=expedition.service.js.map