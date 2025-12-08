"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DeliveryService = void 0;
const db_1 = require("../../config/db");
const schema_1 = require("../../../drizzle/schema");
const drizzle_orm_1 = require("drizzle-orm");
class DeliveryService {
    async createDelivery(data) {
        const trackingNumber = `DEL-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
        await db_1.db.insert(schema_1.delivery).values({
            tracking_number: trackingNumber,
            customer_id: data.customer_id,
            warehouse_id: data.warehouse_id,
            pickup_address: data.pickup_address,
            delivery_address: data.delivery_address,
            delivery_city: data.delivery_city,
            delivery_province: data.delivery_province,
            delivery_postal_code: data.delivery_postal_code,
            notes: data.notes,
            status: 'pending',
            created_by: data.created_by,
        });
        const [newDelivery] = await db_1.db
            .select()
            .from(schema_1.delivery)
            .where((0, drizzle_orm_1.eq)(schema_1.delivery.tracking_number, trackingNumber))
            .limit(1);
        if (data.items && data.items.length > 0) {
            if (!newDelivery) {
                throw new Error('Failed to create delivery');
            }
            const itemsToInsert = data.items.map((item) => ({
                delivery_id: newDelivery.id,
                product_id: item.product_id,
                quantity: item.quantity,
                unit_price: item.unit_price.toString(),
                total_price: (item.quantity * item.unit_price).toString(),
                notes: item.notes,
            }));
            await db_1.db.insert(schema_1.deliveryItem).values(itemsToInsert);
        }
        return newDelivery;
    }
    async getDeliveryWithItems(deliveryId) {
        const deliveryData = await db_1.db
            .select({
            delivery: schema_1.delivery,
            customer: schema_1.customer,
            warehouse: schema_1.warehouse,
        })
            .from(schema_1.delivery)
            .leftJoin(schema_1.customer, (0, drizzle_orm_1.eq)(schema_1.delivery.customer_id, schema_1.customer.id))
            .leftJoin(schema_1.warehouse, (0, drizzle_orm_1.eq)(schema_1.delivery.warehouse_id, schema_1.warehouse.id))
            .where((0, drizzle_orm_1.eq)(schema_1.delivery.id, deliveryId))
            .limit(1);
        if (!deliveryData.length) {
            return null;
        }
        const items = await db_1.db
            .select({
            id: schema_1.deliveryItem.id,
            quantity: schema_1.deliveryItem.quantity,
            unit_price: schema_1.deliveryItem.unit_price,
            total_price: schema_1.deliveryItem.total_price,
            notes: schema_1.deliveryItem.notes,
            product: {
                id: schema_1.product.id,
                name: schema_1.product.name,
                sku: schema_1.product.sku,
                description: schema_1.product.description,
                unit: schema_1.product.unit,
                weight: schema_1.product.weight,
                dimensions: schema_1.product.dimensions,
                status: schema_1.product.status,
                image_url: schema_1.product.image_url,
            },
        })
            .from(schema_1.deliveryItem)
            .innerJoin(schema_1.product, (0, drizzle_orm_1.eq)(schema_1.deliveryItem.product_id, schema_1.product.id))
            .where((0, drizzle_orm_1.eq)(schema_1.deliveryItem.delivery_id, deliveryId));
        const record = deliveryData[0];
        return {
            delivery: record.delivery,
            customer: record.customer,
            warehouse: record.warehouse,
            items,
        };
    }
    async getDeliveryItemsByTracking(trackingNumber) {
        const [deliveryData] = await db_1.db
            .select()
            .from(schema_1.delivery)
            .where((0, drizzle_orm_1.eq)(schema_1.delivery.tracking_number, trackingNumber))
            .limit(1);
        if (!deliveryData) {
            return null;
        }
        const deliveryId = deliveryData.id;
        return this.getDeliveryWithItems(deliveryId);
    }
    async updateDelivery(deliveryId, data) {
        const updateData = {};
        if (data.customer_id !== undefined)
            updateData.customer_id = data.customer_id;
        if (data.warehouse_id !== undefined)
            updateData.warehouse_id = data.warehouse_id;
        if (data.pickup_address !== undefined)
            updateData.pickup_address = data.pickup_address;
        if (data.delivery_address !== undefined)
            updateData.delivery_address = data.delivery_address;
        if (data.delivery_city !== undefined)
            updateData.delivery_city = data.delivery_city;
        if (data.delivery_province !== undefined)
            updateData.delivery_province = data.delivery_province;
        if (data.delivery_postal_code !== undefined)
            updateData.delivery_postal_code = data.delivery_postal_code;
        if (data.notes !== undefined)
            updateData.notes = data.notes;
        await db_1.db
            .update(schema_1.delivery)
            .set(updateData)
            .where((0, drizzle_orm_1.eq)(schema_1.delivery.id, deliveryId));
        if (data.items && data.items.length > 0) {
            await db_1.db
                .delete(schema_1.deliveryItem)
                .where((0, drizzle_orm_1.eq)(schema_1.deliveryItem.delivery_id, deliveryId));
            const itemsToInsert = data.items.map((item) => ({
                delivery_id: deliveryId,
                product_id: item.product_id,
                quantity: item.quantity,
                unit_price: item.unit_price.toString(),
                total_price: (item.quantity * item.unit_price).toString(),
                notes: item.notes,
            }));
            await db_1.db.insert(schema_1.deliveryItem).values(itemsToInsert);
        }
        return this.getDeliveryWithItems(deliveryId);
    }
    async cancelDelivery(deliveryId) {
        await db_1.db
            .update(schema_1.delivery)
            .set({ status: 'cancelled' })
            .where((0, drizzle_orm_1.eq)(schema_1.delivery.id, deliveryId));
        return this.getDeliveryWithItems(deliveryId);
    }
}
exports.DeliveryService = DeliveryService;
//# sourceMappingURL=delivery.service.js.map