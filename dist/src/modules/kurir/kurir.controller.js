"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.KurirController = void 0;
const response_util_1 = require("../../utils/response.util");
const kurir_service_1 = require("./kurir.service");
const kurirService = new kurir_service_1.KurirService();
class KurirController {
    async getAll(req, res) {
        try {
            const page = parseInt(req.query.page) || 1;
            const limit = parseInt(req.query.limit) || 10;
            const kurirs = await kurirService.getKurirs(page, limit);
            return (0, response_util_1.sendSuccess)(res, 'Kurirs retrieved successfully', {
                kurirs,
                pagination: {
                    page,
                    limit,
                },
            });
        }
        catch (error) {
            console.error('Get kurirs error:', error);
            return (0, response_util_1.sendError)(res, 'Failed to fetch kurirs', 500, error.message);
        }
    }
    async getById(req, res) {
        try {
            const { id } = req.params;
            if (!id) {
                return (0, response_util_1.sendError)(res, 'Kurir ID is required', 400);
            }
            const kurir = await kurirService.getKurirById(parseInt(id));
            if (!kurir) {
                return (0, response_util_1.sendError)(res, 'Kurir not found', 404);
            }
            return (0, response_util_1.sendSuccess)(res, 'Kurir retrieved successfully', kurir);
        }
        catch (error) {
            console.error('Get kurir error:', error);
            return (0, response_util_1.sendError)(res, 'Failed to fetch kurir', 500, error.message);
        }
    }
    async updateStatus(req, res) {
        try {
            const { id } = req.params;
            const { status, location } = req.body;
            if (!id || !status) {
                return (0, response_util_1.sendError)(res, 'Kurir ID and status are required', 400);
            }
            const kurir = await kurirService.updateKurirStatus(parseInt(id), status, location);
            return (0, response_util_1.sendSuccess)(res, 'Kurir status updated successfully', kurir);
        }
        catch (error) {
            console.error('Update kurir status error:', error);
            return (0, response_util_1.sendError)(res, 'Failed to update kurir status', 500, error.message);
        }
    }
    async getPerformance(req, res) {
        try {
            const { id } = req.params;
            if (!id) {
                return (0, response_util_1.sendError)(res, 'Kurir ID is required', 400);
            }
            const performance = await kurirService.getKurirPerformance(parseInt(id));
            if (!performance) {
                return (0, response_util_1.sendError)(res, 'Kurir not found', 404);
            }
            return (0, response_util_1.sendSuccess)(res, 'Kurir performance retrieved successfully', performance);
        }
        catch (error) {
            console.error('Get kurir performance error:', error);
            return (0, response_util_1.sendError)(res, 'Failed to fetch kurir performance', 500, error.message);
        }
    }
    async updatePerformance(req, res) {
        try {
            const { id } = req.params;
            const { rating } = req.body;
            if (!id) {
                return (0, response_util_1.sendError)(res, 'Kurir ID is required', 400);
            }
            if (rating === undefined || rating === null) {
                return (0, response_util_1.sendError)(res, 'Rating is required', 400);
            }
            const ratingNum = parseFloat(rating);
            if (isNaN(ratingNum)) {
                return (0, response_util_1.sendError)(res, 'Rating must be a valid number', 400);
            }
            const updatedKurir = await kurirService.updateKurirRating(parseInt(id), ratingNum);
            if (!updatedKurir) {
                return (0, response_util_1.sendError)(res, 'Kurir not found', 404);
            }
            return (0, response_util_1.sendSuccess)(res, 'Kurir rating updated successfully', updatedKurir);
        }
        catch (error) {
            console.error('Update kurir performance error:', error);
            return (0, response_util_1.sendError)(res, error.message || 'Failed to update kurir rating', 500, error.message);
        }
    }
    async getByUserId(req, res) {
        try {
            const userId = req.user?.id;
            if (!userId) {
                return (0, response_util_1.sendError)(res, 'User ID is required', 400);
            }
            const kurirData = await kurirService.getKurirByUserId(userId);
            if (!kurirData) {
                return (0, response_util_1.sendError)(res, 'Kurir profile not found', 404);
            }
            return (0, response_util_1.sendSuccess)(res, 'Kurir retrieved successfully', kurirData);
        }
        catch (error) {
            console.error('Get kurir by user ID error:', error);
            return (0, response_util_1.sendError)(res, 'Failed to fetch kurir', 500, error.message);
        }
    }
    async create(req, res) {
        try {
            const userId = req.body.user_id ? parseInt(req.body.user_id) : req.user?.id;
            if (!userId) {
                return (0, response_util_1.sendError)(res, 'User ID is required', 400);
            }
            const { license_number, vehicle_type, vehicle_plate, current_location, max_capacity } = req.body;
            const newKurir = await kurirService.createKurir(userId, {
                license_number,
                vehicle_type,
                vehicle_plate,
                current_location,
                max_capacity,
            });
            if (!newKurir) {
                return (0, response_util_1.sendError)(res, 'Failed to create kurir profile', 500);
            }
            return (0, response_util_1.sendSuccess)(res, 'Kurir profile created successfully', newKurir);
        }
        catch (error) {
            console.error('Create kurir error:', error);
            return (0, response_util_1.sendError)(res, error.message || 'Failed to create kurir profile', 500, error.message);
        }
    }
    async update(req, res) {
        try {
            const { id } = req.params;
            const { license_number, vehicle_type, vehicle_plate, current_location, max_capacity } = req.body;
            if (!id) {
                return (0, response_util_1.sendError)(res, 'Kurir ID is required', 400);
            }
            const updatedKurir = await kurirService.updateKurir(parseInt(id), {
                license_number,
                vehicle_type,
                vehicle_plate,
                current_location,
                max_capacity,
            });
            if (!updatedKurir) {
                return (0, response_util_1.sendError)(res, 'Kurir not found', 404);
            }
            return (0, response_util_1.sendSuccess)(res, 'Kurir profile updated successfully', updatedKurir);
        }
        catch (error) {
            console.error('Update kurir error:', error);
            return (0, response_util_1.sendError)(res, error.message || 'Failed to update kurir profile', 500, error.message);
        }
    }
    async delete(req, res) {
        try {
            const { id } = req.params;
            if (!id) {
                return (0, response_util_1.sendError)(res, 'Kurir ID is required', 400);
            }
            const result = await kurirService.deleteKurir(parseInt(id));
            if (!result) {
                return (0, response_util_1.sendError)(res, 'Kurir not found', 404);
            }
            return (0, response_util_1.sendSuccess)(res, 'Kurir deleted successfully', { id: parseInt(id) });
        }
        catch (error) {
            console.error('Delete kurir error:', error);
            return (0, response_util_1.sendError)(res, error.message || 'Failed to delete kurir', 500, error.message);
        }
    }
    async getAvailableUsers(req, res) {
        try {
            const users = await kurirService.getAvailableUsers();
            return (0, response_util_1.sendSuccess)(res, 'Available users retrieved successfully', { users });
        }
        catch (error) {
            console.error('Get available users error:', error);
            return (0, response_util_1.sendError)(res, 'Failed to get available users', 500, error.message);
        }
    }
}
exports.KurirController = KurirController;
//# sourceMappingURL=kurir.controller.js.map