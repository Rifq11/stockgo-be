"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReportService = void 0;
const db_1 = require("../../config/db");
const schema_1 = require("../../../drizzle/schema");
const drizzle_orm_1 = require("drizzle-orm");
class ReportService {
    async getDeliveryReport(startDate, endDate, warehouseId) {
        const conditions = [];
        if (startDate) {
            conditions.push((0, drizzle_orm_1.gte)(schema_1.delivery.created_at, new Date(startDate)));
        }
        if (endDate) {
            conditions.push((0, drizzle_orm_1.lte)(schema_1.delivery.created_at, new Date(endDate)));
        }
        if (warehouseId) {
            conditions.push((0, drizzle_orm_1.eq)(schema_1.delivery.warehouse_id, warehouseId));
        }
        const whereClause = conditions.length > 0 ? (0, drizzle_orm_1.and)(...conditions) : undefined;
        const deliveries = await db_1.db
            .select()
            .from(schema_1.delivery)
            .where(whereClause)
            .orderBy((0, drizzle_orm_1.desc)(schema_1.delivery.created_at));
        const totalDeliveries = deliveries.length;
        const successfulDeliveries = deliveries.filter(d => d.status === 'delivered').length;
        const inProgressDeliveries = deliveries.filter(d => ['pending', 'picked_up', 'in_transit'].includes(d.status)).length;
        const failedDeliveries = deliveries.filter(d => ['failed', 'cancelled'].includes(d.status)).length;
        const periodData = this.groupByPeriod(deliveries, startDate, endDate);
        return {
            summary: {
                total_deliveries: totalDeliveries,
                successful_deliveries: successfulDeliveries,
                in_progress_deliveries: inProgressDeliveries,
                failed_deliveries: failedDeliveries,
                success_rate: totalDeliveries > 0 ? ((successfulDeliveries / totalDeliveries) * 100).toFixed(1) + '%' : '0%',
                average_per_day: this.calculateAveragePerDay(deliveries, startDate, endDate),
            },
            period_data: periodData,
        };
    }
    async getKurirReport(startDate, endDate, kurirId) {
        const conditions = [];
        if (startDate) {
            conditions.push((0, drizzle_orm_1.gte)(schema_1.delivery.created_at, new Date(startDate)));
        }
        if (endDate) {
            conditions.push((0, drizzle_orm_1.lte)(schema_1.delivery.created_at, new Date(endDate)));
        }
        if (kurirId) {
            conditions.push((0, drizzle_orm_1.eq)(schema_1.delivery.kurir_id, kurirId));
        }
        const whereClause = conditions.length > 0 ? (0, drizzle_orm_1.and)(...conditions) : undefined;
        const deliveries = await db_1.db
            .select({
            delivery: schema_1.delivery,
            kurir: schema_1.kurir,
            user: schema_1.user,
        })
            .from(schema_1.delivery)
            .leftJoin(schema_1.kurir, (0, drizzle_orm_1.eq)(schema_1.delivery.kurir_id, schema_1.kurir.user_id))
            .leftJoin(schema_1.user, (0, drizzle_orm_1.eq)(schema_1.kurir.user_id, schema_1.user.id))
            .where(whereClause);
        const kurirStats = deliveries.reduce((acc, d) => {
            const kurirId = d.kurir?.id || 'unassigned';
            const kurirName = d.user?.full_name || 'Unassigned';
            if (!acc[kurirId]) {
                acc[kurirId] = {
                    kurir_id: kurirId,
                    kurir_name: kurirName,
                    total_deliveries: 0,
                    successful_deliveries: 0,
                    failed_deliveries: 0,
                    rating: d.kurir?.rating || 0,
                };
            }
            acc[kurirId].total_deliveries++;
            if (d.delivery.status === 'delivered') {
                acc[kurirId].successful_deliveries++;
            }
            else if (['failed', 'cancelled'].includes(d.delivery.status)) {
                acc[kurirId].failed_deliveries++;
            }
            return acc;
        }, {});
        return {
            kurirs: Object.values(kurirStats),
        };
    }
    async getProductReport(startDate, endDate, warehouseId, categoryId) {
        const conditions = [];
        if (startDate) {
            conditions.push((0, drizzle_orm_1.gte)(schema_1.delivery.created_at, new Date(startDate)));
        }
        if (endDate) {
            conditions.push((0, drizzle_orm_1.lte)(schema_1.delivery.created_at, new Date(endDate)));
        }
        if (warehouseId) {
            conditions.push((0, drizzle_orm_1.eq)(schema_1.delivery.warehouse_id, warehouseId));
        }
        const whereClause = conditions.length > 0 ? (0, drizzle_orm_1.and)(...conditions) : undefined;
        const deliveries = await db_1.db
            .select()
            .from(schema_1.delivery)
            .where(whereClause);
        const deliveryIds = deliveries.map(d => d.id);
        if (deliveryIds.length === 0) {
            return {
                products: [],
                summary: {
                    total_products: 0,
                    total_quantity: 0,
                },
            };
        }
        let items = await db_1.db
            .select({
            product: schema_1.product,
            category: schema_1.category,
            quantity: schema_1.deliveryItem.quantity,
            total_price: schema_1.deliveryItem.total_price,
        })
            .from(schema_1.deliveryItem)
            .innerJoin(schema_1.product, (0, drizzle_orm_1.eq)(schema_1.deliveryItem.product_id, schema_1.product.id))
            .innerJoin(schema_1.category, (0, drizzle_orm_1.eq)(schema_1.product.category_id, schema_1.category.id))
            .where((0, drizzle_orm_1.inArray)(schema_1.deliveryItem.delivery_id, deliveryIds));
        if (categoryId) {
            items = items.filter((item) => item.product.category_id === categoryId);
        }
        const productStats = items.reduce((acc, item) => {
            const productId = item.product.id;
            if (!acc[productId]) {
                acc[productId] = {
                    product_id: productId,
                    product_name: item.product.name,
                    category_name: item.category.name,
                    total_quantity: 0,
                    total_revenue: 0,
                };
            }
            acc[productId].total_quantity += item.quantity;
            acc[productId].total_revenue += parseFloat(item.total_price || '0');
            return acc;
        }, {});
        const products = Object.values(productStats);
        const totalQuantity = products.reduce((sum, p) => sum + p.total_quantity, 0);
        return {
            products,
            summary: {
                total_products: products.length,
                total_quantity: totalQuantity,
            },
        };
    }
    async getWarehouseReport(startDate, endDate, warehouseId) {
        const conditions = [];
        if (startDate) {
            conditions.push((0, drizzle_orm_1.gte)(schema_1.delivery.created_at, new Date(startDate)));
        }
        if (endDate) {
            conditions.push((0, drizzle_orm_1.lte)(schema_1.delivery.created_at, new Date(endDate)));
        }
        if (warehouseId) {
            conditions.push((0, drizzle_orm_1.eq)(schema_1.delivery.warehouse_id, warehouseId));
        }
        const whereClause = conditions.length > 0 ? (0, drizzle_orm_1.and)(...conditions) : undefined;
        const deliveries = await db_1.db
            .select({
            delivery: schema_1.delivery,
            warehouse: schema_1.warehouse,
        })
            .from(schema_1.delivery)
            .leftJoin(schema_1.warehouse, (0, drizzle_orm_1.eq)(schema_1.delivery.warehouse_id, schema_1.warehouse.id))
            .where(whereClause);
        const warehouseStats = deliveries.reduce((acc, d) => {
            const whId = (d.warehouse?.id ?? 'unknown').toString();
            const whName = d.warehouse?.name || 'Unknown';
            if (!acc[whId]) {
                acc[whId] = {
                    warehouse_id: whId,
                    warehouse_name: whName,
                    total_deliveries: 0,
                    successful_deliveries: 0,
                    failed_deliveries: 0,
                };
            }
            acc[whId].total_deliveries++;
            if (d.delivery.status === 'delivered') {
                acc[whId].successful_deliveries++;
            }
            else if (['failed', 'cancelled'].includes(d.delivery.status)) {
                acc[whId].failed_deliveries++;
            }
            return acc;
        }, {});
        return {
            warehouses: Object.values(warehouseStats),
        };
    }
    groupByPeriod(deliveries, startDate, endDate) {
        const periods = {};
        deliveries.forEach(delivery => {
            if (!delivery?.created_at)
                return;
            const date = new Date(delivery.created_at);
            const weekStart = this.getWeekStart(date);
            const [weekKey] = weekStart.toISOString().split('T');
            if (!weekKey)
                return;
            if (!periods[weekKey]) {
                periods[weekKey] = {
                    period: this.formatWeek(weekStart),
                    total: 0,
                    successful: 0,
                    in_progress: 0,
                    failed: 0,
                };
            }
            const period = periods[weekKey];
            period.total++;
            if (delivery.status === 'delivered') {
                period.successful++;
            }
            else if (['pending', 'picked_up', 'in_transit'].includes(delivery.status)) {
                period.in_progress++;
            }
            else if (['failed', 'cancelled'].includes(delivery.status)) {
                period.failed++;
            }
        });
        return Object.values(periods).map((p) => ({
            ...p,
            success_rate: p.total > 0 ? ((p.successful / p.total) * 100).toFixed(1) + '%' : '0%',
        }));
    }
    getWeekStart(date) {
        const d = new Date(date);
        const day = d.getDay();
        const diff = d.getDate() - day + (day === 0 ? -6 : 1);
        return new Date(d.setDate(diff));
    }
    formatWeek(date) {
        const start = new Date(date);
        const end = new Date(date);
        end.setDate(start.getDate() + 6);
        const startStr = start.toLocaleDateString('id-ID', { day: 'numeric', month: 'short' });
        const endStr = end.toLocaleDateString('id-ID', { day: 'numeric', month: 'short' });
        return `Minggu (${startStr} - ${endStr})`;
    }
    calculateAveragePerDay(deliveries, startDate, endDate) {
        if (deliveries.length === 0)
            return 0;
        const start = startDate ? new Date(startDate) : new Date(Math.min(...deliveries.map(d => new Date(d.created_at).getTime())));
        const end = endDate ? new Date(endDate) : new Date(Math.max(...deliveries.map(d => new Date(d.created_at).getTime())));
        const days = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) || 1;
        return Math.round(deliveries.length / days);
    }
}
exports.ReportService = ReportService;
//# sourceMappingURL=report.service.js.map