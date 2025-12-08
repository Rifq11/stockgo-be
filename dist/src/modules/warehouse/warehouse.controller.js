"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WarehouseController = void 0;
const response_util_1 = require("../../utils/response.util");
const warehouse_service_1 = require("./warehouse.service");
const warehouseService = new warehouse_service_1.WarehouseService();
class WarehouseController {
    async getAll(req, res) {
        try {
            const page = parseInt(req.query.page) || 1;
            const limit = parseInt(req.query.limit) || 10;
            const warehouses = await warehouseService.getWarehouses(page, limit);
            return (0, response_util_1.sendSuccess)(res, 'Warehouses retrieved successfully', {
                warehouses,
                pagination: {
                    page,
                    limit,
                },
            });
        }
        catch (error) {
            console.error('Get warehouses error:', error);
            return (0, response_util_1.sendError)(res, 'Failed to fetch warehouses', 500, error.message);
        }
    }
    async getById(req, res) {
        try {
            const { id } = req.params;
            if (!id) {
                return (0, response_util_1.sendError)(res, 'Warehouse ID is required', 400);
            }
            const warehouse = await warehouseService.getWarehouseById(parseInt(id));
            if (!warehouse) {
                return (0, response_util_1.sendError)(res, 'Warehouse not found', 404);
            }
            return (0, response_util_1.sendSuccess)(res, 'Warehouse retrieved successfully', warehouse);
        }
        catch (error) {
            console.error('Get warehouse error:', error);
            return (0, response_util_1.sendError)(res, 'Failed to fetch warehouse', 500, error.message);
        }
    }
    async create(req, res) {
        try {
            const { name, code, type, address, city, province, postal_code, phone, email, manager_id } = req.body;
            if (!name || !code || !type || !address || !city || !province) {
                return (0, response_util_1.sendError)(res, 'Name, code, type, address, city, and province are required', 400);
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
            return (0, response_util_1.sendSuccess)(res, 'Warehouse created successfully', warehouse, 201);
        }
        catch (error) {
            console.error('Create warehouse error:', error);
            return (0, response_util_1.sendError)(res, 'Failed to create warehouse', 500, error.message);
        }
    }
    async update(req, res) {
        try {
            const { id } = req.params;
            const data = req.body;
            if (!id) {
                return (0, response_util_1.sendError)(res, 'Warehouse ID is required', 400);
            }
            const warehouse = await warehouseService.updateWarehouse(parseInt(id), data);
            return (0, response_util_1.sendSuccess)(res, 'Warehouse updated successfully', warehouse);
        }
        catch (error) {
            console.error('Update warehouse error:', error);
            return (0, response_util_1.sendError)(res, 'Failed to update warehouse', 500, error.message);
        }
    }
    async delete(req, res) {
        try {
            const { id } = req.params;
            if (!id) {
                return (0, response_util_1.sendError)(res, 'Warehouse ID is required', 400);
            }
            await warehouseService.deleteWarehouse(parseInt(id));
            return (0, response_util_1.sendSuccess)(res, 'Warehouse deleted successfully');
        }
        catch (error) {
            console.error('Delete warehouse error:', error);
            return (0, response_util_1.sendError)(res, 'Failed to delete warehouse', 500, error.message);
        }
    }
}
exports.WarehouseController = WarehouseController;
//# sourceMappingURL=warehouse.controller.js.map