"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.KurirService = void 0;
const db_1 = require("../../config/db");
const schema_1 = require("../../../drizzle/schema");
const drizzle_orm_1 = require("drizzle-orm");
class KurirService {
    async getKurirs(page = 1, limit = 10) {
        const offset = (page - 1) * limit;
        const kurirs = await db_1.db
            .select({
            kurir: schema_1.kurir,
            user: schema_1.user,
        })
            .from(schema_1.kurir)
            .innerJoin(schema_1.user, (0, drizzle_orm_1.eq)(schema_1.kurir.user_id, schema_1.user.id))
            .limit(limit)
            .offset(offset);
        return kurirs.map(k => ({
            ...k.kurir,
            user: k.user,
        }));
    }
    async getKurirById(id) {
        const [foundKurir] = await db_1.db
            .select({
            kurir: schema_1.kurir,
            user: schema_1.user,
        })
            .from(schema_1.kurir)
            .innerJoin(schema_1.user, (0, drizzle_orm_1.eq)(schema_1.kurir.user_id, schema_1.user.id))
            .where((0, drizzle_orm_1.eq)(schema_1.kurir.id, id))
            .limit(1);
        if (!foundKurir) {
            return null;
        }
        return {
            ...foundKurir.kurir,
            user: foundKurir.user,
        };
    }
    async updateKurirStatus(id, status, location) {
        await db_1.db
            .update(schema_1.kurir)
            .set({
            status: status,
            ...(location && { current_location: location }),
        })
            .where((0, drizzle_orm_1.eq)(schema_1.kurir.id, id));
        return this.getKurirById(id);
    }
    async getKurirPerformance(id, startDate, endDate) {
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
    async updateKurirRating(id, rating) {
        if (rating < 0 || rating > 5) {
            throw new Error('Rating must be between 0 and 5');
        }
        await db_1.db
            .update(schema_1.kurir)
            .set({
            rating: rating.toString(),
        })
            .where((0, drizzle_orm_1.eq)(schema_1.kurir.id, id));
        return this.getKurirById(id);
    }
    async getKurirByUserId(userId) {
        const [foundKurir] = await db_1.db
            .select({
            kurir: schema_1.kurir,
            user: schema_1.user,
        })
            .from(schema_1.kurir)
            .innerJoin(schema_1.user, (0, drizzle_orm_1.eq)(schema_1.kurir.user_id, schema_1.user.id))
            .where((0, drizzle_orm_1.eq)(schema_1.kurir.user_id, userId))
            .limit(1);
        if (!foundKurir) {
            return null;
        }
        return {
            ...foundKurir.kurir,
            user: foundKurir.user,
        };
    }
    async createKurir(userId, data) {
        const lastKurir = await db_1.db
            .select()
            .from(schema_1.kurir)
            .orderBy((0, drizzle_orm_1.desc)(schema_1.kurir.id))
            .limit(1);
        let nextNumber = 1;
        if (lastKurir.length > 0 && lastKurir[0]) {
            const lastEmployeeId = lastKurir[0].employee_id;
            if (lastEmployeeId && (lastEmployeeId.startsWith('KUR-') || lastEmployeeId.startsWith('KUR_'))) {
                const numStr = lastEmployeeId.substring(4);
                const parsed = parseInt(numStr);
                if (!isNaN(parsed)) {
                    nextNumber = parsed + 1;
                }
            }
        }
        const employeeId = `KUR-${nextNumber.toString().padStart(3, '0')}`;
        const [newKurir] = await db_1.db
            .insert(schema_1.kurir)
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
    async updateKurir(id, data) {
        await db_1.db
            .update(schema_1.kurir)
            .set({
            ...(data.license_number !== undefined && { license_number: data.license_number }),
            ...(data.vehicle_type !== undefined && { vehicle_type: data.vehicle_type }),
            ...(data.vehicle_plate !== undefined && { vehicle_plate: data.vehicle_plate }),
            ...(data.current_location !== undefined && { current_location: data.current_location }),
            ...(data.max_capacity !== undefined && { max_capacity: data.max_capacity }),
        })
            .where((0, drizzle_orm_1.eq)(schema_1.kurir.id, id));
        return this.getKurirById(id);
    }
    async deleteKurir(id) {
        const kurirData = await this.getKurirById(id);
        if (!kurirData) {
            return null;
        }
        await db_1.db.delete(schema_1.kurir).where((0, drizzle_orm_1.eq)(schema_1.kurir.id, id));
        return { success: true };
    }
    async getAvailableUsers() {
        const allUsers = await db_1.db.select().from(schema_1.user);
        const kurirUserIds = await db_1.db.select({ user_id: schema_1.kurir.user_id }).from(schema_1.kurir);
        const kurirIdsSet = new Set(kurirUserIds.map(k => k.user_id));
        return allUsers.filter(u => !kurirIdsSet.has(u.id));
    }
}
exports.KurirService = KurirService;
//# sourceMappingURL=kurir.service.js.map