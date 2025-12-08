import { db } from '../../config/db';
import { delivery, deliveryItem, product, customer, warehouse } from '../../../drizzle/schema';
import { eq, and } from 'drizzle-orm';

export interface CreateDeliveryItem {
  product_id: number;
  quantity: number;
  unit_price: number;
  notes?: string;
}

export class DeliveryService {
  async createDelivery(data: {
    customer_id: number;
    warehouse_id: number;
    pickup_address: string;
    delivery_address: string;
    delivery_city: string;
    delivery_province: string;
    delivery_postal_code?: string;
    notes?: string;
    items: CreateDeliveryItem[];
    created_by: number;
  }) {
    const trackingNumber = `DEL-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;

    await db.insert(delivery).values({
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

    const [newDelivery] = await db
      .select()
      .from(delivery)
      .where(eq(delivery.tracking_number, trackingNumber))
      .limit(1);

    if (data.items && data.items.length > 0) {
      if (!newDelivery) {
        throw new Error('Failed to create delivery');
      }
      const itemsToInsert = data.items.map((item) => ({
        delivery_id: newDelivery!.id,
        product_id: item.product_id,
        quantity: item.quantity,
        unit_price: item.unit_price.toString(),
        total_price: (item.quantity * item.unit_price).toString(),
        notes: item.notes,
      }));

      await db.insert(deliveryItem).values(itemsToInsert);
    }

    return newDelivery;
  }

  async getDeliveryWithItems(deliveryId: number) {
    const deliveryData = await db
      .select({
        delivery,
        customer,
        warehouse,
      })
      .from(delivery)
      .leftJoin(customer, eq(delivery.customer_id, customer.id))
      .leftJoin(warehouse, eq(delivery.warehouse_id, warehouse.id))
      .where(eq(delivery.id, deliveryId))
      .limit(1);

    if (!deliveryData.length) {
      return null;
    }

    const items = await db
      .select({
        id: deliveryItem.id,
        quantity: deliveryItem.quantity,
        unit_price: deliveryItem.unit_price,
        total_price: deliveryItem.total_price,
        notes: deliveryItem.notes,
        product: {
          id: product.id,
          name: product.name,
          sku: product.sku,
          description: product.description,
          unit: product.unit,
          weight: product.weight,
          dimensions: product.dimensions,
          status: product.status,
          image_url: product.image_url,
        },
      })
      .from(deliveryItem)
      .innerJoin(product, eq(deliveryItem.product_id, product.id))
      .where(eq(deliveryItem.delivery_id, deliveryId));

    const record = deliveryData[0]!;
    return {
      delivery: record.delivery,
      customer: record.customer,
      warehouse: record.warehouse,
      items,
    };
  }

  async getDeliveryItemsByTracking(trackingNumber: string) {
    const [deliveryData] = await db
      .select()
      .from(delivery)
      .where(eq(delivery.tracking_number, trackingNumber))
      .limit(1);

    if (!deliveryData) {
      return null;
    }

    const deliveryId = deliveryData!.id;
    return this.getDeliveryWithItems(deliveryId);
  }

  async updateDelivery(deliveryId: number, data: {
    customer_id?: number;
    warehouse_id?: number;
    pickup_address?: string;
    delivery_address?: string;
    delivery_city?: string;
    delivery_province?: string;
    delivery_postal_code?: string;
    notes?: string;
    items?: CreateDeliveryItem[];
  }) {
    const updateData: any = {};
    
    if (data.customer_id !== undefined) updateData.customer_id = data.customer_id;
    if (data.warehouse_id !== undefined) updateData.warehouse_id = data.warehouse_id;
    if (data.pickup_address !== undefined) updateData.pickup_address = data.pickup_address;
    if (data.delivery_address !== undefined) updateData.delivery_address = data.delivery_address;
    if (data.delivery_city !== undefined) updateData.delivery_city = data.delivery_city;
    if (data.delivery_province !== undefined) updateData.delivery_province = data.delivery_province;
    if (data.delivery_postal_code !== undefined) updateData.delivery_postal_code = data.delivery_postal_code;
    if (data.notes !== undefined) updateData.notes = data.notes;

    await db
      .update(delivery)
      .set(updateData)
      .where(eq(delivery.id, deliveryId));

    if (data.items && data.items.length > 0) {
      await db
        .delete(deliveryItem)
        .where(eq(deliveryItem.delivery_id, deliveryId));

      const itemsToInsert = data.items.map((item) => ({
        delivery_id: deliveryId,
        product_id: item.product_id,
        quantity: item.quantity,
        unit_price: item.unit_price.toString(),
        total_price: (item.quantity * item.unit_price).toString(),
        notes: item.notes,
      }));

      await db.insert(deliveryItem).values(itemsToInsert);
    }

    return this.getDeliveryWithItems(deliveryId);
  }

  async cancelDelivery(deliveryId: number) {
    await db
      .update(delivery)
      .set({ status: 'cancelled' })
      .where(eq(delivery.id, deliveryId));

    return this.getDeliveryWithItems(deliveryId);
  }
}

