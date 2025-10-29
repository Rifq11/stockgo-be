import { Response } from 'express';
import { AuthRequest } from '../../middleware/auth.middleware';
import { sendSuccess, sendError } from '../../utils/response.util';
import { WarehouseService } from './warehouse.service';

const warehouseService = new WarehouseService();

export class WarehouseController {
  async getAll(req: AuthRequest, res: Response) {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;

      const warehouses = await warehouseService.getWarehouses(page, limit);

      return sendSuccess(res, 'Warehouses retrieved successfully', {
        warehouses,
        pagination: {
          page,
          limit,
        },
      });
    } catch (error: any) {
      console.error('Get warehouses error:', error);
      return sendError(res, 'Failed to fetch warehouses', 500, error.message);
    }
  }

  async getById(req: AuthRequest, res: Response) {
    try {
      const { id } = req.params;

      if (!id) {
        return sendError(res, 'Warehouse ID is required', 400);
      }

      const warehouse = await warehouseService.getWarehouseById(parseInt(id));

      if (!warehouse) {
        return sendError(res, 'Warehouse not found', 404);
      }

      return sendSuccess(res, 'Warehouse retrieved successfully', warehouse);
    } catch (error: any) {
      console.error('Get warehouse error:', error);
      return sendError(res, 'Failed to fetch warehouse', 500, error.message);
    }
  }

  async create(req: AuthRequest, res: Response) {
    try {
      const { name, code, type, address, city, province, postal_code, phone, email, manager_id } = req.body;

      if (!name || !code || !type || !address || !city || !province) {
        return sendError(res, 'Name, code, type, address, city, and province are required', 400);
      }

      const warehouse = await warehouseService.createWarehouse({
        name,
        code,
        type,
        address,
        city,
        province,
        postal_code,
        phone,
        email,
        manager_id,
      });

      return sendSuccess(res, 'Warehouse created successfully', warehouse, 201);
    } catch (error: any) {
      console.error('Create warehouse error:', error);
      return sendError(res, 'Failed to create warehouse', 500, error.message);
    }
  }

  async update(req: AuthRequest, res: Response) {
    try {
      const { id } = req.params;
      const data = req.body;

      if (!id) {
        return sendError(res, 'Warehouse ID is required', 400);
      }

      const warehouse = await warehouseService.updateWarehouse(parseInt(id), data);

      return sendSuccess(res, 'Warehouse updated successfully', warehouse);
    } catch (error: any) {
      console.error('Update warehouse error:', error);
      return sendError(res, 'Failed to update warehouse', 500, error.message);
    }
  }

  async delete(req: AuthRequest, res: Response) {
    try {
      const { id } = req.params;

      if (!id) {
        return sendError(res, 'Warehouse ID is required', 400);
      }

      await warehouseService.deleteWarehouse(parseInt(id));

      return sendSuccess(res, 'Warehouse deleted successfully');
    } catch (error: any) {
      console.error('Delete warehouse error:', error);
      return sendError(res, 'Failed to delete warehouse', 500, error.message);
    }
  }
}
