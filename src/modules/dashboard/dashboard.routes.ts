import { Router } from 'express';
import { DashboardController } from './dashboard.controller';
import { authenticate, authorize } from '../../middleware/auth.middleware';

const router = Router();
const dashboardController = new DashboardController();

router.get('/stats', authenticate, authorize('admin', 'dispatcher'), dashboardController.getDashboardStats.bind(dashboardController));
router.get('/analytics', authenticate, authorize('admin', 'dispatcher'), dashboardController.getDeliveryAnalytics.bind(dashboardController));
router.get('/kurir-performance', authenticate, authorize('admin'), dashboardController.getKurirPerformance.bind(dashboardController));
router.get('/warehouse-stats', authenticate, authorize('admin', 'dispatcher'), dashboardController.getWarehouseStats.bind(dashboardController));

export default router;

