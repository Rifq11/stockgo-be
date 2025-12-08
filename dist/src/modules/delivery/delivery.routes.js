"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const delivery_controller_1 = require("./delivery.controller");
const auth_middleware_1 = require("../../middleware/auth.middleware");
const router = (0, express_1.Router)();
const deliveryController = new delivery_controller_1.DeliveryController();
router.get('/track/:tracking_number', deliveryController.getDeliveryByTracking.bind(deliveryController));
router.post('/', auth_middleware_1.authenticate, (0, auth_middleware_1.authorize)('admin', 'dispatcher'), deliveryController.createDelivery.bind(deliveryController));
router.get('/', auth_middleware_1.authenticate, deliveryController.getDeliveries.bind(deliveryController));
router.get('/:id', auth_middleware_1.authenticate, deliveryController.getDeliveryById.bind(deliveryController));
router.put('/:id', auth_middleware_1.authenticate, (0, auth_middleware_1.authorize)('admin', 'dispatcher'), deliveryController.updateDelivery.bind(deliveryController));
router.put('/:id/status', auth_middleware_1.authenticate, (0, auth_middleware_1.authorize)('admin', 'kurir'), deliveryController.updateDeliveryStatus.bind(deliveryController));
router.put('/:id/assign', auth_middleware_1.authenticate, (0, auth_middleware_1.authorize)('admin', 'dispatcher'), deliveryController.assignKurir.bind(deliveryController));
router.delete('/:id', auth_middleware_1.authenticate, (0, auth_middleware_1.authorize)('admin', 'dispatcher'), deliveryController.cancelDelivery.bind(deliveryController));
exports.default = router;
//# sourceMappingURL=delivery.routes.js.map