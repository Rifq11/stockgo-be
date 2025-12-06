import { Router } from 'express';
import { ReportController } from './report.controller';
import { authenticate, authorize } from '../../middleware/auth.middleware';

const router = Router();
const reportController = new ReportController();

router.get('/delivery', authenticate, authorize('admin', 'dispatcher'), reportController.getDeliveryReport.bind(reportController));
router.get('/kurir', authenticate, authorize('admin'), reportController.getKurirReport.bind(reportController));
router.get('/product', authenticate, authorize('admin', 'dispatcher'), reportController.getProductReport.bind(reportController));
router.get('/warehouse', authenticate, authorize('admin', 'dispatcher'), reportController.getWarehouseReport.bind(reportController));

export default router;

