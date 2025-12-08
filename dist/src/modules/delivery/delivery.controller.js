"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DeliveryController = void 0;
const db_1 = require("../../config/db");
const schema_1 = require("../../../drizzle/schema");
const drizzle_orm_1 = require("drizzle-orm");
const response_util_1 = require("../../utils/response.util");
const delivery_service_1 = require("./delivery.service");
const deliveryService = new delivery_service_1.DeliveryService();
class DeliveryController {
    async createDelivery(req, res) {
        try {
            const { customer_id, warehouse_id, pickup_address, delivery_address, delivery_city, delivery_province, delivery_postal_code, notes, items, } = req.body;
            if (!customer_id || !warehouse_id || !delivery_address) {
                return (0, response_util_1.sendError)(res, 'Customer, warehouse, and delivery address are required', 400);
            }
            if (!items || items.length === 0) {
                return (0, response_util_1.sendError)(res, 'At least one item is required', 400);
            }
            const newDelivery = await deliveryService.createDelivery({
                customer_id,
                warehouse_id,
                pickup_address,
                delivery_address,
                delivery_city,
                delivery_province,
                delivery_postal_code,
                notes,
                items,
                created_by: req.user.id,
            });
            if (newDelivery?.id) {
                await db_1.db.insert(schema_1.deliveryStatusHistory).values({
                    delivery_id: newDelivery.id,
                    status: 'pending',
                    notes: 'Delivery created',
                    updated_by: req.user.id,
                });
            }
            return (0, response_util_1.sendSuccess)(res, 'Delivery created successfully', newDelivery, 201);
        }
        catch (error) {
            console.error('Create delivery error:', error);
            return (0, response_util_1.sendError)(res, 'Failed to create delivery', 500, error.message);
        }
    }
    async getDeliveries(req, res) {
        try {
            const page = parseInt(req.query.page) || 1;
            const limit = parseInt(req.query.limit) || 10;
            const offset = (page - 1) * limit;
            const status = req.query.status;
            const customer_id = req.query.customer_id;
            const conditions = [];
            if (status) {
                conditions.push((0, drizzle_orm_1.eq)(schema_1.delivery.status, status));
            }
            if (customer_id) {
                conditions.push((0, drizzle_orm_1.eq)(schema_1.delivery.customer_id, parseInt(customer_id)));
            }
            if (req.user && req.user.role === 'kurir') {
                const [kurirData] = await db_1.db
                    .select({ id: schema_1.kurir.id })
                    .from(schema_1.kurir)
                    .where((0, drizzle_orm_1.eq)(schema_1.kurir.user_id, req.user.id))
                    .limit(1);
                if (kurirData) {
                    conditions.push((0, drizzle_orm_1.eq)(schema_1.delivery.kurir_id, kurirData.id));
                }
                else {
                    return (0, response_util_1.sendSuccess)(res, 'Deliveries retrieved successfully', {
                        deliveries: [],
                        pagination: {
                            page,
                            limit,
                        },
                    });
                }
            }
            const whereClause = conditions.length > 0 ? (0, drizzle_orm_1.and)(...conditions) : undefined;
            const deliveries = await db_1.db
                .select({
                delivery: schema_1.delivery,
                customer: schema_1.customer,
                kurir: schema_1.kurir,
                kurirUser: schema_1.user,
            })
                .from(schema_1.delivery)
                .leftJoin(schema_1.customer, (0, drizzle_orm_1.eq)(schema_1.delivery.customer_id, schema_1.customer.id))
                .leftJoin(schema_1.kurir, (0, drizzle_orm_1.eq)(schema_1.delivery.kurir_id, schema_1.kurir.id))
                .leftJoin(schema_1.user, (0, drizzle_orm_1.eq)(schema_1.kurir.user_id, schema_1.user.id))
                .where(whereClause)
                .limit(limit)
                .offset(offset)
                .orderBy((0, drizzle_orm_1.desc)(schema_1.delivery.created_at));
            const mappedDeliveries = deliveries.map(d => ({
                delivery: d.delivery,
                customer: d.customer,
                kurir: d.kurirUser ? {
                    id: d.kurirUser.id,
                    full_name: d.kurirUser.full_name,
                    phone: d.kurirUser.phone,
                } : null,
            }));
            return (0, response_util_1.sendSuccess)(res, 'Deliveries retrieved successfully', {
                deliveries: mappedDeliveries,
                pagination: {
                    page,
                    limit,
                },
            });
        }
        catch (error) {
            console.error('Get deliveries error:', error);
            return (0, response_util_1.sendError)(res, 'Failed to get deliveries', 500, error.message);
        }
    }
    async getDeliveryByTracking(req, res) {
        try {
            const { tracking_number } = req.params;
            if (!tracking_number) {
                return (0, response_util_1.sendError)(res, 'Tracking number is required', 400);
            }
            const deliveryData = await deliveryService.getDeliveryItemsByTracking(tracking_number);
            if (!deliveryData) {
                return (0, response_util_1.sendError)(res, 'Delivery not found', 404);
            }
            const statusHistory = await db_1.db
                .select()
                .from(schema_1.deliveryStatusHistory)
                .where((0, drizzle_orm_1.eq)(schema_1.deliveryStatusHistory.delivery_id, deliveryData.delivery.id))
                .orderBy((0, drizzle_orm_1.desc)(schema_1.deliveryStatusHistory.created_at));
            return (0, response_util_1.sendSuccess)(res, 'Delivery retrieved successfully', {
                ...deliveryData,
                status_history: statusHistory,
            });
        }
        catch (error) {
            console.error('Get delivery error:', error);
            return (0, response_util_1.sendError)(res, 'Failed to get delivery', 500, error.message);
        }
    }
    async getDeliveryById(req, res) {
        try {
            const { id } = req.params;
            if (!id) {
                return (0, response_util_1.sendError)(res, 'Delivery ID is required', 400);
            }
            const deliveryData = await deliveryService.getDeliveryWithItems(parseInt(id));
            if (!deliveryData) {
                return (0, response_util_1.sendError)(res, 'Delivery not found', 404);
            }
            if (req.user && req.user.role === 'kurir') {
                const [kurirData] = await db_1.db
                    .select({ id: schema_1.kurir.id })
                    .from(schema_1.kurir)
                    .where((0, drizzle_orm_1.eq)(schema_1.kurir.user_id, req.user.id))
                    .limit(1);
                if (!kurirData || deliveryData.delivery.kurir_id !== kurirData.id) {
                    return (0, response_util_1.sendError)(res, 'Access denied. This delivery is not assigned to you.', 403);
                }
            }
            const statusHistory = await db_1.db
                .select()
                .from(schema_1.deliveryStatusHistory)
                .where((0, drizzle_orm_1.eq)(schema_1.deliveryStatusHistory.delivery_id, deliveryData.delivery.id))
                .orderBy((0, drizzle_orm_1.desc)(schema_1.deliveryStatusHistory.created_at));
            return (0, response_util_1.sendSuccess)(res, 'Delivery retrieved successfully', {
                ...deliveryData,
                status_history: statusHistory,
            });
        }
        catch (error) {
            console.error('Get delivery error:', error);
            return (0, response_util_1.sendError)(res, 'Failed to get delivery', 500, error.message);
        }
    }
    async updateDeliveryStatus(req, res) {
        try {
            const { id } = req.params;
            const { status, notes, location } = req.body;
            if (!id) {
                return (0, response_util_1.sendError)(res, 'Delivery ID is required', 400);
            }
            await db_1.db
                .update(schema_1.delivery)
                .set({ status })
                .where((0, drizzle_orm_1.eq)(schema_1.delivery.id, parseInt(id)));
            const [updatedDelivery] = await db_1.db
                .select()
                .from(schema_1.delivery)
                .where((0, drizzle_orm_1.eq)(schema_1.delivery.id, parseInt(id)))
                .limit(1);
            if (!updatedDelivery) {
                return (0, response_util_1.sendError)(res, 'Delivery not found', 404);
            }
            await db_1.db.insert(schema_1.deliveryStatusHistory).values({
                delivery_id: updatedDelivery.id,
                status,
                notes,
                location,
                updated_by: req.user.id,
            });
            const detail = await deliveryService.getDeliveryWithItems(updatedDelivery.id);
            const statusHistory = await db_1.db
                .select()
                .from(schema_1.deliveryStatusHistory)
                .where((0, drizzle_orm_1.eq)(schema_1.deliveryStatusHistory.delivery_id, updatedDelivery.id))
                .orderBy((0, drizzle_orm_1.desc)(schema_1.deliveryStatusHistory.created_at));
            return (0, response_util_1.sendSuccess)(res, 'Delivery status updated successfully', {
                ...detail,
                status_history: statusHistory,
            });
        }
        catch (error) {
            console.error('Update delivery status error:', error);
            return (0, response_util_1.sendError)(res, 'Failed to update delivery status', 500, error.message);
        }
    }
    async assignKurir(req, res) {
        try {
            const { id } = req.params;
            const { kurir_id } = req.body;
            if (!id) {
                return (0, response_util_1.sendError)(res, 'Delivery ID is required', 400);
            }
            if (!kurir_id) {
                return (0, response_util_1.sendError)(res, 'Kurir ID is required', 400);
            }
            await db_1.db
                .update(schema_1.delivery)
                .set({ kurir_id: parseInt(kurir_id) })
                .where((0, drizzle_orm_1.eq)(schema_1.delivery.id, parseInt(id)));
            const [updatedDelivery] = await db_1.db
                .select()
                .from(schema_1.delivery)
                .where((0, drizzle_orm_1.eq)(schema_1.delivery.id, parseInt(id)))
                .limit(1);
            if (!updatedDelivery) {
                return (0, response_util_1.sendError)(res, 'Delivery not found', 404);
            }
            return (0, response_util_1.sendSuccess)(res, 'Kurir assigned successfully', updatedDelivery);
        }
        catch (error) {
            console.error('Assign kurir error:', error);
            return (0, response_util_1.sendError)(res, 'Failed to assign kurir', 500, error.message);
        }
    }
    async updateDelivery(req, res) {
        try {
            const { id } = req.params;
            const { customer_id, warehouse_id, pickup_address, delivery_address, delivery_city, delivery_province, delivery_postal_code, notes, items, } = req.body;
            if (!id) {
                return (0, response_util_1.sendError)(res, 'Delivery ID is required', 400);
            }
            const existingDelivery = await deliveryService.getDeliveryWithItems(parseInt(id));
            if (!existingDelivery) {
                return (0, response_util_1.sendError)(res, 'Delivery not found', 404);
            }
            const updatedDelivery = await deliveryService.updateDelivery(parseInt(id), {
                customer_id,
                warehouse_id,
                pickup_address,
                delivery_address,
                delivery_city,
                delivery_province,
                delivery_postal_code,
                notes,
                items,
            });
            return (0, response_util_1.sendSuccess)(res, 'Delivery updated successfully', updatedDelivery);
        }
        catch (error) {
            console.error('Update delivery error:', error);
            return (0, response_util_1.sendError)(res, 'Failed to update delivery', 500, error.message);
        }
    }
    async cancelDelivery(req, res) {
        try {
            const { id } = req.params;
            if (!id) {
                return (0, response_util_1.sendError)(res, 'Delivery ID is required', 400);
            }
            const existingDelivery = await deliveryService.getDeliveryWithItems(parseInt(id));
            if (!existingDelivery) {
                return (0, response_util_1.sendError)(res, 'Delivery not found', 404);
            }
            const cancelledDelivery = await deliveryService.cancelDelivery(parseInt(id));
            await db_1.db.insert(schema_1.deliveryStatusHistory).values({
                delivery_id: parseInt(id),
                status: 'cancelled',
                notes: 'Delivery cancelled',
                updated_by: req.user.id,
            });
            return (0, response_util_1.sendSuccess)(res, 'Delivery cancelled successfully', cancelledDelivery);
        }
        catch (error) {
            console.error('Cancel delivery error:', error);
            return (0, response_util_1.sendError)(res, 'Failed to cancel delivery', 500, error.message);
        }
    }
}
exports.DeliveryController = DeliveryController;
//# sourceMappingURL=delivery.controller.js.map