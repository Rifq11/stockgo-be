"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const dashboard_controller_1 = require("./dashboard.controller");
const auth_middleware_1 = require("../../middleware/auth.middleware");
const router = (0, express_1.Router)();
const dashboardController = new dashboard_controller_1.DashboardController();
router.get('/stats', auth_middleware_1.authenticate, (0, auth_middleware_1.authorize)('admin', 'dispatcher'), dashboardController.getDashboardStats.bind(dashboardController));
router.get('/analytics', auth_middleware_1.authenticate, (0, auth_middleware_1.authorize)('admin', 'dispatcher'), dashboardController.getDeliveryAnalytics.bind(dashboardController));
router.get('/kurir-performance', auth_middleware_1.authenticate, (0, auth_middleware_1.authorize)('admin'), dashboardController.getKurirPerformance.bind(dashboardController));
router.get('/warehouse-stats', auth_middleware_1.authenticate, (0, auth_middleware_1.authorize)('admin', 'dispatcher'), dashboardController.getWarehouseStats.bind(dashboardController));
exports.default = router;
//# sourceMappingURL=dashboard.routes.js.map