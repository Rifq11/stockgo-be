import { Response } from 'express';
import { AuthRequest } from '../../middleware/auth.middleware';
import { db } from '../../config/db';
import { customer } from '../../../drizzle/schema';
import { eq, and } from 'drizzle-orm';
import { sendSuccess, sendError } from '../../utils/response.util';
import { CustomerService } from './customer.service';

const customerService = new CustomerService();

export class CustomerController {
  async createCustomer(req: AuthRequest, res: Response) {
    try {
      const { name, email, phone, address, city, province, postal_code } = req.body;

      if (!name || !address || !city || !province) {
        return sendError(res, 'Name, address, city, and province are required', 400);
      }

      const newCustomer = await customerService.createCustomer({
        name,
        email,
        phone,
        address,
        city,
        province,
        postal_code,
      });

      return sendSuccess(res, 'Customer created successfully', newCustomer, 201);
    } catch (error: any) {
      console.error('Create customer error:', error);
      return sendError(res, 'Failed to create customer', 500, error.message);
    }
  }

  async getCustomers(req: AuthRequest, res: Response) {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;

      const customers = await customerService.getCustomers(page, limit);

      return sendSuccess(res, 'Customers retrieved successfully', {
        customers,
        pagination: {
          page,
          limit,
        },
      });
    } catch (error: any) {
      console.error('Get customers error:', error);
      return sendError(res, 'Failed to get customers', 500, error.message);
    }
  }

  async getCustomerById(req: AuthRequest, res: Response) {
    try {
      const { id } = req.params;

      if (!id) {
        return sendError(res, 'Customer ID is required', 400);
      }

      const foundCustomer = await customerService.getCustomerById(parseInt(id));

      if (!foundCustomer) {
        return sendError(res, 'Customer not found', 404);
      }

      return sendSuccess(res, 'Customer retrieved successfully', foundCustomer);
    } catch (error: any) {
      console.error('Get customer error:', error);
      return sendError(res, 'Failed to get customer', 500, error.message);
    }
  }

  async updateCustomer(req: AuthRequest, res: Response) {
    try {
      const { id } = req.params;
      const { name, email, phone, address, city, province, postal_code } = req.body;

      if (!id) {
        return sendError(res, 'Customer ID is required', 400);
      }

      await db
        .update(customer)
        .set({
          name,
          email,
          phone,
          address,
          city,
          province,
          postal_code,
        })
        .where(eq(customer.id, parseInt(id)));

      const [updatedCustomer] = await db
        .select()
        .from(customer)
        .where(eq(customer.id, parseInt(id)))
        .limit(1);

      if (!updatedCustomer) {
        return sendError(res, 'Customer not found', 404);
      }

      return sendSuccess(res, 'Customer updated successfully', updatedCustomer);
    } catch (error: any) {
      console.error('Update customer error:', error);
      return sendError(res, 'Failed to update customer', 500, error.message);
    }
  }

  async deleteCustomer(req: AuthRequest, res: Response) {
    try {
      const { id } = req.params;

      if (!id) {
        return sendError(res, 'Customer ID is required', 400);
      }

      await db
        .update(customer)
        .set({ is_active: false })
        .where(eq(customer.id, parseInt(id)));

      return sendSuccess(res, 'Customer deleted successfully');
    } catch (error: any) {
      console.error('Delete customer error:', error);
      return sendError(res, 'Failed to delete customer', 500, error.message);
    }
  }
}

