"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CustomerController = void 0;
const db_1 = require("../../config/db");
const schema_1 = require("../../../drizzle/schema");
const drizzle_orm_1 = require("drizzle-orm");
const response_util_1 = require("../../utils/response.util");
const customer_service_1 = require("./customer.service");
const customerService = new customer_service_1.CustomerService();
class CustomerController {
    async createCustomer(req, res) {
        try {
            const { name, email, phone, address, city, province, postal_code } = req.body;
            if (!name || !address || !city || !province) {
                return (0, response_util_1.sendError)(res, 'Name, address, city, and province are required', 400);
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
            return (0, response_util_1.sendSuccess)(res, 'Customer created successfully', newCustomer, 201);
        }
        catch (error) {
            console.error('Create customer error:', error);
            return (0, response_util_1.sendError)(res, 'Failed to create customer', 500, error.message);
        }
    }
    async getCustomers(req, res) {
        try {
            const page = parseInt(req.query.page) || 1;
            const limit = parseInt(req.query.limit) || 10;
            const customers = await customerService.getCustomers(page, limit);
            return (0, response_util_1.sendSuccess)(res, 'Customers retrieved successfully', {
                customers,
                pagination: {
                    page,
                    limit,
                },
            });
        }
        catch (error) {
            console.error('Get customers error:', error);
            return (0, response_util_1.sendError)(res, 'Failed to get customers', 500, error.message);
        }
    }
    async getCustomerById(req, res) {
        try {
            const { id } = req.params;
            if (!id) {
                return (0, response_util_1.sendError)(res, 'Customer ID is required', 400);
            }
            const foundCustomer = await customerService.getCustomerById(parseInt(id));
            if (!foundCustomer) {
                return (0, response_util_1.sendError)(res, 'Customer not found', 404);
            }
            return (0, response_util_1.sendSuccess)(res, 'Customer retrieved successfully', foundCustomer);
        }
        catch (error) {
            console.error('Get customer error:', error);
            return (0, response_util_1.sendError)(res, 'Failed to get customer', 500, error.message);
        }
    }
    async updateCustomer(req, res) {
        try {
            const { id } = req.params;
            const { name, email, phone, address, city, province, postal_code } = req.body;
            if (!id) {
                return (0, response_util_1.sendError)(res, 'Customer ID is required', 400);
            }
            await db_1.db
                .update(schema_1.customer)
                .set({
                name,
                email,
                phone,
                address,
                city,
                province,
                postal_code,
            })
                .where((0, drizzle_orm_1.eq)(schema_1.customer.id, parseInt(id)));
            const [updatedCustomer] = await db_1.db
                .select()
                .from(schema_1.customer)
                .where((0, drizzle_orm_1.eq)(schema_1.customer.id, parseInt(id)))
                .limit(1);
            if (!updatedCustomer) {
                return (0, response_util_1.sendError)(res, 'Customer not found', 404);
            }
            return (0, response_util_1.sendSuccess)(res, 'Customer updated successfully', updatedCustomer);
        }
        catch (error) {
            console.error('Update customer error:', error);
            return (0, response_util_1.sendError)(res, 'Failed to update customer', 500, error.message);
        }
    }
    async deleteCustomer(req, res) {
        try {
            const { id } = req.params;
            if (!id) {
                return (0, response_util_1.sendError)(res, 'Customer ID is required', 400);
            }
            await db_1.db
                .update(schema_1.customer)
                .set({ is_active: false })
                .where((0, drizzle_orm_1.eq)(schema_1.customer.id, parseInt(id)));
            return (0, response_util_1.sendSuccess)(res, 'Customer deleted successfully');
        }
        catch (error) {
            console.error('Delete customer error:', error);
            return (0, response_util_1.sendError)(res, 'Failed to delete customer', 500, error.message);
        }
    }
}
exports.CustomerController = CustomerController;
//# sourceMappingURL=customer.controller.js.map