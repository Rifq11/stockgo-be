"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DashboardController = void 0;
const response_util_1 = require("../../utils/response.util");
const dashboard_service_1 = require("./dashboard.service");
const dashboardService = new dashboard_service_1.DashboardService();
class DashboardController {
    async getDashboardStats(req, res) {
        try {
            const { warehouse_id, start_date, end_date } = req.query;
            const stats = await dashboardService.getDashboardStats(warehouse_id ? parseInt(warehouse_id) : undefined, start_date, end_date);
            return (0, response_util_1.sendSuccess)(res, 'Dashboard stats retrieved successfully', stats);
        }
        catch (error) {
            console.error('Get dashboard stats error:', error);
            return (0, response_util_1.sendError)(res, 'Failed to get dashboard stats', 500, error.message);
        }
    }
    async getDeliveryAnalytics(req, res) {
        try {
            const { warehouse_id, start_date, end_date } = req.query;
            const analytics = await dashboardService.getDeliveryAnalytics(warehouse_id ? parseInt(warehouse_id) : undefined, start_date, end_date);
            return (0, response_util_1.sendSuccess)(res, 'Delivery analytics retrieved successfully', analytics);
        }
        catch (error) {
            console.error('Get delivery analytics error:', error);
            return (0, response_util_1.sendError)(res, 'Failed to get delivery analytics', 500, error.message);
        }
    }
    async getKurirPerformance(req, res) {
        try {
            const { start_date, end_date } = req.query;
            const performance = await dashboardService.getKurirPerformance(start_date, end_date);
            return (0, response_util_1.sendSuccess)(res, 'Kurir performance retrieved successfully', performance);
        }
        catch (error) {
            console.error('Get kurir performance error:', error);
            return (0, response_util_1.sendError)(res, 'Failed to get kurir performance', 500, error.message);
        }
    }
    async getWarehouseStats(req, res) {
        try {
            const stats = await dashboardService.getWarehouseStats();
            return (0, response_util_1.sendSuccess)(res, 'Warehouse stats retrieved successfully', stats);
        }
        catch (error) {
            console.error('Get warehouse stats error:', error);
            return (0, response_util_1.sendError)(res, 'Failed to get warehouse stats', 500, error.message);
        }
    }
}
exports.DashboardController = DashboardController;
//# sourceMappingURL=dashboard.controller.js.map