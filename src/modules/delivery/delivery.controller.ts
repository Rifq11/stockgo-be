import { Response } from 'express';
import { AuthRequest } from '../../middleware/auth.middleware';
import { db } from '../../config/db';
import { delivery, customer, user, deliveryStatusHistory } from '../../../drizzle/schema';
import { eq, and, desc } from 'drizzle-orm';
import { sendSuccess, sendError } from '../../utils/response.util';
import { DeliveryService } from './delivery.service';

const deliveryService = new DeliveryService();

export class DeliveryController {
  async createDelivery(req: AuthRequest, res: Response) {
    try {
      const {
        customer_id,
        warehouse_id,
        pickup_address,
        delivery_address,
        delivery_city,
        delivery_province,
        delivery_postal_code,
        notes,
        items,
      } = req.body;

      if (!customer_id || !warehouse_id || !delivery_address) {
        return sendError(res, 'Customer, warehouse, and delivery address are required', 400);
      }

      if (!items || items.length === 0) {
        return sendError(res, 'At least one item is required', 400);
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
        created_by: req.user!.id,
      });

      if (newDelivery?.id) {
        await db.insert(deliveryStatusHistory).values({
          delivery_id: newDelivery.id,
          status: 'pending',
          notes: 'Delivery created',
          updated_by: req.user!.id,
        });
      }

      return sendSuccess(res, 'Delivery created successfully', newDelivery, 201);
    } catch (error: any) {
      console.error('Create delivery error:', error);
      return sendError(res, 'Failed to create delivery', 500, error.message);
    }
  }

  async getDeliveries(req: AuthRequest, res: Response) {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      const offset = (page - 1) * limit;
      const status = req.query.status as string;
      const customer_id = req.query.customer_id as string;

      const conditions = [];
      if (status) {
        conditions.push(eq(delivery.status, status as any));
      }
      if (customer_id) {
        conditions.push(eq(delivery.customer_id, parseInt(customer_id)));
      }

      const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

      const deliveries = await db
        .select({
          delivery,
          customer,
          kurir: user,
        })
        .from(delivery)
        .leftJoin(customer, eq(delivery.customer_id, customer.id))
        .leftJoin(user, eq(delivery.kurir_id, user.id))
        .where(whereClause)
        .limit(limit)
        .offset(offset)
        .orderBy(desc(delivery.created_at));

      return sendSuccess(res, 'Deliveries retrieved successfully', {
        deliveries,
        pagination: {
          page,
          limit,
        },
      });
    } catch (error: any) {
      console.error('Get deliveries error:', error);
      return sendError(res, 'Failed to get deliveries', 500, error.message);
    }
  }

  async getDeliveryByTracking(req: AuthRequest, res: Response) {
    try {
      const { tracking_number } = req.params;

      if (!tracking_number) {
        return sendError(res, 'Tracking number is required', 400);
      }

      const deliveryData = await deliveryService.getDeliveryItemsByTracking(tracking_number);

      if (!deliveryData) {
        return sendError(res, 'Delivery not found', 404);
      }

      const statusHistory = await db
        .select()
        .from(deliveryStatusHistory)
        .where(eq(deliveryStatusHistory.delivery_id, deliveryData.delivery.id))
        .orderBy(desc(deliveryStatusHistory.created_at));

      return sendSuccess(res, 'Delivery retrieved successfully', {
        ...deliveryData,
        status_history: statusHistory,
      });
    } catch (error: any) {
      console.error('Get delivery error:', error);
      return sendError(res, 'Failed to get delivery', 500, error.message);
    }
  }

  async getDeliveryById(req: AuthRequest, res: Response) {
    try {
      const { id } = req.params;

      if (!id) {
        return sendError(res, 'Delivery ID is required', 400);
      }

      const deliveryData = await deliveryService.getDeliveryWithItems(parseInt(id));

      if (!deliveryData) {
        return sendError(res, 'Delivery not found', 404);
      }

      const statusHistory = await db
        .select()
        .from(deliveryStatusHistory)
        .where(eq(deliveryStatusHistory.delivery_id, deliveryData.delivery.id))
        .orderBy(desc(deliveryStatusHistory.created_at));

      return sendSuccess(res, 'Delivery retrieved successfully', {
        ...deliveryData,
        status_history: statusHistory,
      });
    } catch (error: any) {
      console.error('Get delivery error:', error);
      return sendError(res, 'Failed to get delivery', 500, error.message);
    }
  }

  async updateDeliveryStatus(req: AuthRequest, res: Response) {
    try {
      const { id } = req.params;
      const { status, notes, location } = req.body;

      if (!id) {
        return sendError(res, 'Delivery ID is required', 400);
      }

      await db
        .update(delivery)
        .set({ status })
        .where(eq(delivery.id, parseInt(id)));

      const [updatedDelivery] = await db
        .select()
        .from(delivery)
        .where(eq(delivery.id, parseInt(id)))
        .limit(1);

      if (!updatedDelivery) {
        return sendError(res, 'Delivery not found', 404);
      }

      await db.insert(deliveryStatusHistory).values({
        delivery_id: updatedDelivery.id,
        status,
        notes,
        location,
        updated_by: req.user!.id,
      });

      const detail = await deliveryService.getDeliveryWithItems(updatedDelivery.id);
      const statusHistory = await db
        .select()
        .from(deliveryStatusHistory)
        .where(eq(deliveryStatusHistory.delivery_id, updatedDelivery.id))
        .orderBy(desc(deliveryStatusHistory.created_at));

      return sendSuccess(res, 'Delivery status updated successfully', {
        ...detail,
        status_history: statusHistory,
      });
    } catch (error: any) {
      console.error('Update delivery status error:', error);
      return sendError(res, 'Failed to update delivery status', 500, error.message);
    }
  }

  async assignKurir(req: AuthRequest, res: Response) {
    try {
      const { id } = req.params;
      const { kurir_id } = req.body;

      if (!id) {
        return sendError(res, 'Delivery ID is required', 400);
      }

      if (!kurir_id) {
        return sendError(res, 'Kurir ID is required', 400);
      }

      await db
        .update(delivery)
        .set({ kurir_id: parseInt(kurir_id) })
        .where(eq(delivery.id, parseInt(id)));

      const [updatedDelivery] = await db
        .select()
        .from(delivery)
        .where(eq(delivery.id, parseInt(id)))
        .limit(1);

      if (!updatedDelivery) {
        return sendError(res, 'Delivery not found', 404);
      }

      return sendSuccess(res, 'Kurir assigned successfully', updatedDelivery);
    } catch (error: any) {
      console.error('Assign kurir error:', error);
      return sendError(res, 'Failed to assign kurir', 500, error.message);
    }
  }

  async updateDelivery(req: AuthRequest, res: Response) {
    try {
      const { id } = req.params;
      const {
        customer_id,
        warehouse_id,
        pickup_address,
        delivery_address,
        delivery_city,
        delivery_province,
        delivery_postal_code,
        notes,
        items,
      } = req.body;

      if (!id) {
        return sendError(res, 'Delivery ID is required', 400);
      }

      const existingDelivery = await deliveryService.getDeliveryWithItems(parseInt(id));
      if (!existingDelivery) {
        return sendError(res, 'Delivery not found', 404);
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

      return sendSuccess(res, 'Delivery updated successfully', updatedDelivery);
    } catch (error: any) {
      console.error('Update delivery error:', error);
      return sendError(res, 'Failed to update delivery', 500, error.message);
    }
  }

  async cancelDelivery(req: AuthRequest, res: Response) {
    try {
      const { id } = req.params;

      if (!id) {
        return sendError(res, 'Delivery ID is required', 400);
      }

      const existingDelivery = await deliveryService.getDeliveryWithItems(parseInt(id));
      if (!existingDelivery) {
        return sendError(res, 'Delivery not found', 404);
      }

      const cancelledDelivery = await deliveryService.cancelDelivery(parseInt(id));

      // Add status history
      await db.insert(deliveryStatusHistory).values({
        delivery_id: parseInt(id),
        status: 'cancelled',
        notes: 'Delivery cancelled',
        updated_by: req.user!.id,
      });

      return sendSuccess(res, 'Delivery cancelled successfully', cancelledDelivery);
    } catch (error: any) {
      console.error('Cancel delivery error:', error);
      return sendError(res, 'Failed to cancel delivery', 500, error.message);
    }
  }
}

