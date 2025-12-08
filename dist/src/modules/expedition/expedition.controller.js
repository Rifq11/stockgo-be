"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ExpeditionController = void 0;
const response_util_1 = require("../../utils/response.util");
const expedition_service_1 = require("./expedition.service");
const expeditionService = new expedition_service_1.ExpeditionService();
class ExpeditionController {
    async getAll(req, res) {
        try {
            const page = parseInt(req.query.page) || 1;
            const limit = parseInt(req.query.limit) || 10;
            const expeditions = await expeditionService.getExpeditions(page, limit);
            return (0, response_util_1.sendSuccess)(res, 'Expeditions retrieved successfully', {
                expeditions,
                pagination: {
                    page,
                    limit,
                },
            });
        }
        catch (error) {
            console.error('Get expeditions error:', error);
            return (0, response_util_1.sendError)(res, 'Failed to fetch expeditions', 500, error.message);
        }
    }
    async getById(req, res) {
        try {
            const { id } = req.params;
            if (!id) {
                return (0, response_util_1.sendError)(res, 'Expedition ID is required', 400);
            }
            const expedition = await expeditionService.getExpeditionById(parseInt(id));
            if (!expedition) {
                return (0, response_util_1.sendError)(res, 'Expedition not found', 404);
            }
            return (0, response_util_1.sendSuccess)(res, 'Expedition retrieved successfully', expedition);
        }
        catch (error) {
            console.error('Get expedition error:', error);
            return (0, response_util_1.sendError)(res, 'Failed to fetch expedition', 500, error.message);
        }
    }
    async create(req, res) {
        try {
            const { warehouse_id, kurir_id, notes, delivery_ids } = req.body;
            if (!warehouse_id || !delivery_ids || !Array.isArray(delivery_ids)) {
                return (0, response_util_1.sendError)(res, 'Warehouse ID and delivery IDs are required', 400);
            }
            const expedition = await expeditionService.createExpedition({
                warehouse_id,
                kurir_id,
                notes,
                delivery_ids,
                created_by: req.user.id,
            });
            return (0, response_util_1.sendSuccess)(res, 'Expedition created successfully', expedition, 201);
        }
        catch (error) {
            console.error('Create expedition error:', error);
            return (0, response_util_1.sendError)(res, 'Failed to create expedition', 500, error.message);
        }
    }
    async updateStatus(req, res) {
        try {
            const { id } = req.params;
            const { status, notes } = req.body;
            if (!id || !status) {
                return (0, response_util_1.sendError)(res, 'Expedition ID and status are required', 400);
            }
            const expedition = await expeditionService.updateExpeditionStatus(parseInt(id), status, notes);
            return (0, response_util_1.sendSuccess)(res, 'Expedition status updated successfully', expedition);
        }
        catch (error) {
            console.error('Update expedition status error:', error);
            return (0, response_util_1.sendError)(res, 'Failed to update expedition status', 500, error.message);
        }
    }
    async getReport(req, res) {
        try {
            const { warehouse_id, date_from, date_to } = req.query;
            const report = await expeditionService.getExpeditionReport(warehouse_id ? parseInt(warehouse_id) : undefined, date_from, date_to);
            return (0, response_util_1.sendSuccess)(res, 'Expedition report retrieved successfully', report);
        }
        catch (error) {
            console.error('Get expedition report error:', error);
            return (0, response_util_1.sendError)(res, 'Failed to fetch expedition report', 500, error.message);
        }
    }
}
exports.ExpeditionController = ExpeditionController;
//# sourceMappingURL=expedition.controller.js.map