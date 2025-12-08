"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const report_controller_1 = require("./report.controller");
const auth_middleware_1 = require("../../middleware/auth.middleware");
const router = (0, express_1.Router)();
const reportController = new report_controller_1.ReportController();
router.get('/delivery', auth_middleware_1.authenticate, (0, auth_middleware_1.authorize)('admin', 'dispatcher'), reportController.getDeliveryReport.bind(reportController));
router.get('/kurir', auth_middleware_1.authenticate, (0, auth_middleware_1.authorize)('admin'), reportController.getKurirReport.bind(reportController));
router.get('/product', auth_middleware_1.authenticate, (0, auth_middleware_1.authorize)('admin', 'dispatcher'), reportController.getProductReport.bind(reportController));
router.get('/warehouse', auth_middleware_1.authenticate, (0, auth_middleware_1.authorize)('admin', 'dispatcher'), reportController.getWarehouseReport.bind(reportController));
exports.default = router;
//# sourceMappingURL=report.routes.js.map