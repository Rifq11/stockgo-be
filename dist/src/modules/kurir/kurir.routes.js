"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const kurir_controller_1 = require("./kurir.controller");
const auth_middleware_1 = require("../../middleware/auth.middleware");
const router = (0, express_1.Router)();
const kurirController = new kurir_controller_1.KurirController();
router.get('/', auth_middleware_1.authenticate, kurirController.getAll.bind(kurirController));
router.get('/available-users', auth_middleware_1.authenticate, (0, auth_middleware_1.authorize)('admin', 'dispatcher'), kurirController.getAvailableUsers.bind(kurirController));
router.get('/me', auth_middleware_1.authenticate, kurirController.getByUserId.bind(kurirController));
router.post('/', auth_middleware_1.authenticate, (0, auth_middleware_1.authorize)('admin', 'dispatcher'), kurirController.create.bind(kurirController));
router.get('/:id', auth_middleware_1.authenticate, kurirController.getById.bind(kurirController));
router.put('/:id', auth_middleware_1.authenticate, (0, auth_middleware_1.authorize)('admin', 'dispatcher'), kurirController.update.bind(kurirController));
router.delete('/:id', auth_middleware_1.authenticate, (0, auth_middleware_1.authorize)('admin'), kurirController.delete.bind(kurirController));
router.put('/:id/status', auth_middleware_1.authenticate, kurirController.updateStatus.bind(kurirController));
router.get('/:id/performance', auth_middleware_1.authenticate, kurirController.getPerformance.bind(kurirController));
router.put('/:id/performance', auth_middleware_1.authenticate, kurirController.updatePerformance.bind(kurirController));
exports.default = router;
//# sourceMappingURL=kurir.routes.js.map