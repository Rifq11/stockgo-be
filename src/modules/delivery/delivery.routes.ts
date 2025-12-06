import { Router } from 'express';
import { DeliveryController } from './delivery.controller';
import { authenticate, authorize } from '../../middleware/auth.middleware';

const router = Router();
const deliveryController = new DeliveryController();

// Public endpoint for tracking (no auth required)
router.get('/track/:tracking_number', deliveryController.getDeliveryByTracking.bind(deliveryController));

// Protected routes
router.post('/', authenticate, authorize('admin', 'dispatcher'), deliveryController.createDelivery.bind(deliveryController));
router.get('/', authenticate, deliveryController.getDeliveries.bind(deliveryController));
router.get('/:id', authenticate, deliveryController.getDeliveryById.bind(deliveryController));
router.put('/:id', authenticate, authorize('admin', 'dispatcher'), deliveryController.updateDelivery.bind(deliveryController));
router.put('/:id/status', authenticate, authorize('admin', 'kurir'), deliveryController.updateDeliveryStatus.bind(deliveryController));
router.put('/:id/assign', authenticate, authorize('admin', 'dispatcher'), deliveryController.assignKurir.bind(deliveryController));
router.delete('/:id', authenticate, authorize('admin', 'dispatcher'), deliveryController.cancelDelivery.bind(deliveryController));

export default router;

