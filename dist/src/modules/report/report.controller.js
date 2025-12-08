"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReportController = void 0;
const response_util_1 = require("../../utils/response.util");
const report_service_1 = require("./report.service");
const reportService = new report_service_1.ReportService();
class ReportController {
    async getDeliveryReport(req, res) {
        try {
            const { start_date, end_date, warehouse_id } = req.query;
            const report = await reportService.getDeliveryReport(start_date, end_date, warehouse_id ? parseInt(warehouse_id) : undefined);
            return (0, response_util_1.sendSuccess)(res, 'Delivery report retrieved successfully', report);
        }
        catch (error) {
            console.error('Get delivery report error:', error);
            return (0, response_util_1.sendError)(res, 'Failed to get delivery report', 500, error.message);
        }
    }
    async getKurirReport(req, res) {
        try {
            const { start_date, end_date, kurir_id } = req.query;
            const report = await reportService.getKurirReport(start_date, end_date, kurir_id ? parseInt(kurir_id) : undefined);
            return (0, response_util_1.sendSuccess)(res, 'Kurir report retrieved successfully', report);
        }
        catch (error) {
            console.error('Get kurir report error:', error);
            return (0, response_util_1.sendError)(res, 'Failed to get kurir report', 500, error.message);
        }
    }
    async getProductReport(req, res) {
        try {
            const { start_date, end_date, warehouse_id, category_id } = req.query;
            const report = await reportService.getProductReport(start_date, end_date, warehouse_id ? parseInt(warehouse_id) : undefined, category_id ? parseInt(category_id) : undefined);
            return (0, response_util_1.sendSuccess)(res, 'Product report retrieved successfully', report);
        }
        catch (error) {
            console.error('Get product report error:', error);
            return (0, response_util_1.sendError)(res, 'Failed to get product report', 500, error.message);
        }
    }
    async getWarehouseReport(req, res) {
        try {
            const { start_date, end_date, warehouse_id } = req.query;
            const report = await reportService.getWarehouseReport(start_date, end_date, warehouse_id ? parseInt(warehouse_id) : undefined);
            return (0, response_util_1.sendSuccess)(res, 'Warehouse report retrieved successfully', report);
        }
        catch (error) {
            console.error('Get warehouse report error:', error);
            return (0, response_util_1.sendError)(res, 'Failed to get warehouse report', 500, error.message);
        }
    }
}
exports.ReportController = ReportController;
//# sourceMappingURL=report.controller.js.map