"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const expedition_controller_1 = require("./expedition.controller");
const router = (0, express_1.Router)();
const expeditionController = new expedition_controller_1.ExpeditionController();
router.get('/', expeditionController.getAll.bind(expeditionController));
router.get('/reports/summary', expeditionController.getReport.bind(expeditionController));
router.get('/:id', expeditionController.getById.bind(expeditionController));
router.post('/', expeditionController.create.bind(expeditionController));
router.put('/:id/status', expeditionController.updateStatus.bind(expeditionController));
exports.default = router;
//# sourceMappingURL=expedition.routes.js.map