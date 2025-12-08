import { db } from '../../config/db';
import { delivery, deliveryItem, product, inventory, warehouse, kurir, user, category } from '../../../drizzle/schema';
import { eq, and, gte, lte, sql, desc, inArray } from 'drizzle-orm';

export class ReportService {
  async getDeliveryReport(startDate?: string, endDate?: string, warehouseId?: number) {
    const conditions = [];
    
    if (startDate) {
      conditions.push(gte(delivery.created_at, new Date(startDate)));
    }
    if (endDate) {
      conditions.push(lte(delivery.created_at, new Date(endDate)));
    }
    if (warehouseId) {
      conditions.push(eq(delivery.warehouse_id, warehouseId));
    }

    const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

    const deliveries = await db
      .select()
      .from(delivery)
      .where(whereClause)
      .orderBy(desc(delivery.created_at));

    const totalDeliveries = deliveries.length;
    const successfulDeliveries = deliveries.filter(d => d.status === 'delivered').length;
    const inProgressDeliveries = deliveries.filter(d => ['pending', 'picked_up', 'in_transit'].includes(d.status)).length;
    const failedDeliveries = deliveries.filter(d => ['failed', 'cancelled'].includes(d.status)).length;

    // Group by period (weekly)
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

  async getKurirReport(startDate?: string, endDate?: string, kurirId?: number) {
    const conditions = [];
    
    if (startDate) {
      conditions.push(gte(delivery.created_at, new Date(startDate)));
    }
    if (endDate) {
      conditions.push(lte(delivery.created_at, new Date(endDate)));
    }
    if (kurirId) {
      conditions.push(eq(delivery.kurir_id, kurirId));
    }

    const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

    const deliveries = await db
      .select({
        delivery,
        kurir: kurir,
        user: user,
      })
      .from(delivery)
      .leftJoin(kurir, eq(delivery.kurir_id, kurir.user_id))
      .leftJoin(user, eq(kurir.user_id, user.id))
      .where(whereClause);

    // Group by kurir
    const kurirStats = deliveries.reduce((acc: any, d: any) => {
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
      } else if (['failed', 'cancelled'].includes(d.delivery.status)) {
        acc[kurirId].failed_deliveries++;
      }
      
      return acc;
    }, {});

    return {
      kurirs: Object.values(kurirStats),
    };
  }

  async getProductReport(startDate?: string, endDate?: string, warehouseId?: number, categoryId?: number) {
    const conditions = [];
    
    if (startDate) {
      conditions.push(gte(delivery.created_at, new Date(startDate)));
    }
    if (endDate) {
      conditions.push(lte(delivery.created_at, new Date(endDate)));
    }
    if (warehouseId) {
      conditions.push(eq(delivery.warehouse_id, warehouseId));
    }

    const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

    const deliveries = await db
      .select()
      .from(delivery)
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

    let items = await db
      .select({
        product,
        category,
        quantity: deliveryItem.quantity,
        total_price: deliveryItem.total_price,
      })
      .from(deliveryItem)
      .innerJoin(product, eq(deliveryItem.product_id, product.id))
      .innerJoin(category, eq(product.category_id, category.id))
      .where(inArray(deliveryItem.delivery_id, deliveryIds));

    if (categoryId) {
      items = items.filter((item: any) => item.product.category_id === categoryId);
    }

    // Group by product
    const productStats = items.reduce((acc: any, item: any) => {
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
    const totalQuantity = products.reduce((sum: number, p: any) => sum + p.total_quantity, 0);

    return {
      products,
      summary: {
        total_products: products.length,
        total_quantity: totalQuantity,
      },
    };
  }

  async getWarehouseReport(startDate?: string, endDate?: string, warehouseId?: number) {
    const conditions = [];
    
    if (startDate) {
      conditions.push(gte(delivery.created_at, new Date(startDate)));
    }
    if (endDate) {
      conditions.push(lte(delivery.created_at, new Date(endDate)));
    }
    if (warehouseId) {
      conditions.push(eq(delivery.warehouse_id, warehouseId));
    }

    const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

    const deliveries = await db
      .select({
        delivery,
        warehouse,
      })
      .from(delivery)
      .leftJoin(warehouse, eq(delivery.warehouse_id, warehouse.id))
      .where(whereClause);

    // Group by warehouse
    const warehouseStats = deliveries.reduce((acc: Record<string, any>, d: any) => {
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
      } else if (['failed', 'cancelled'].includes(d.delivery.status)) {
        acc[whId].failed_deliveries++;
      }
      
      return acc;
    }, {});

    return {
      warehouses: Object.values(warehouseStats),
    };
  }

  private groupByPeriod(deliveries: any[], startDate?: string, endDate?: string) {
    // Group by week
    const periods: Record<string, any> = {};
    
    deliveries.forEach(delivery => {
      if (!delivery?.created_at) return;
      const date = new Date(delivery.created_at);
      const weekStart = this.getWeekStart(date);
      const [weekKey] = weekStart.toISOString().split('T');
      if (!weekKey) return;
      
      if (!periods[weekKey]) {
        periods[weekKey] = {
          period: this.formatWeek(weekStart),
          total: 0,
          successful: 0,
          in_progress: 0,
          failed: 0,
        };
      }
      
      const period = periods[weekKey]!;
      period.total++;
      if (delivery.status === 'delivered') {
        period.successful++;
      } else if (['pending', 'picked_up', 'in_transit'].includes(delivery.status)) {
        period.in_progress++;
      } else if (['failed', 'cancelled'].includes(delivery.status)) {
        period.failed++;
      }
    });

    return Object.values(periods).map((p: any) => ({
      ...p,
      success_rate: p.total > 0 ? ((p.successful / p.total) * 100).toFixed(1) + '%' : '0%',
    }));
  }

  private getWeekStart(date: Date): Date {
    const d = new Date(date);
    const day = d.getDay();
    const diff = d.getDate() - day + (day === 0 ? -6 : 1); // Adjust when day is Sunday
    return new Date(d.setDate(diff));
  }

  private formatWeek(date: Date): string {
    const start = new Date(date);
    const end = new Date(date);
    end.setDate(start.getDate() + 6);
    
    const startStr = start.toLocaleDateString('id-ID', { day: 'numeric', month: 'short' });
    const endStr = end.toLocaleDateString('id-ID', { day: 'numeric', month: 'short' });
    
    return `Minggu (${startStr} - ${endStr})`;
  }

  private calculateAveragePerDay(deliveries: any[], startDate?: string, endDate?: string): number {
    if (deliveries.length === 0) return 0;
    
    const start = startDate ? new Date(startDate) : new Date(Math.min(...deliveries.map(d => new Date(d.created_at).getTime())));
    const end = endDate ? new Date(endDate) : new Date(Math.max(...deliveries.map(d => new Date(d.created_at).getTime())));
    
    const days = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) || 1;
    return Math.round(deliveries.length / days);
  }
}

