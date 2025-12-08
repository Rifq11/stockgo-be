"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WarehouseService = void 0;
const db_1 = require("../../config/db");
const schema_1 = require("../../../drizzle/schema");
const drizzle_orm_1 = require("drizzle-orm");
class WarehouseService {
    async getWarehouses(page = 1, limit = 10) {
        const offset = (page - 1) * limit;
        const warehouses = await db_1.db
            .select()
            .from(schema_1.warehouse)
            .where((0, drizzle_orm_1.eq)(schema_1.warehouse.is_active, true))
            .limit(limit)
            .offset(offset);
        return warehouses;
    }
    async getWarehouseById(id) {
        const [foundWarehouse] = await db_1.db
            .select()
            .from(schema_1.warehouse)
            .where((0, drizzle_orm_1.eq)(schema_1.warehouse.id, id))
            .limit(1);
        return foundWarehouse;
    }
    async createWarehouse(data) {
        await db_1.db.insert(schema_1.warehouse).values({
            name: data.name,
            code: data.code,
            type: data.type,
            address: data.address,
            city: data.city,
            province: data.province,
            postal_code: data.postal_code,
            phone: data.phone,
            email: data.email,
            manager_id: data.manager_id,
            is_active: true,
        });
        const [created] = await db_1.db
            .select()
            .from(schema_1.warehouse)
            .where((0, drizzle_orm_1.eq)(schema_1.warehouse.code, data.code))
            .limit(1);
        return created;
    }
    async updateWarehouse(id, data) {
        await db_1.db
            .update(schema_1.warehouse)
            .set(data)
            .where((0, drizzle_orm_1.eq)(schema_1.warehouse.id, id));
        return this.getWarehouseById(id);
    }
    async deleteWarehouse(id) {
        await db_1.db
            .update(schema_1.warehouse)
            .set({ is_active: false })
            .where((0, drizzle_orm_1.eq)(schema_1.warehouse.id, id));
    }
}
exports.WarehouseService = WarehouseService;
//# sourceMappingURL=warehouse.service.js.map