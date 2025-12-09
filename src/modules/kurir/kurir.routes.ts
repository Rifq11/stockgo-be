import { Router } from 'express';
import { KurirController } from './kurir.controller';
import { authenticate, authorize } from '../../middleware/auth.middleware';

const router = Router();
const kurirController = new KurirController();

router.get('/', authenticate, kurirController.getAll.bind(kurirController));
router.get('/available-users', authenticate, authorize('admin', 'dispatcher'), kurirController.getAvailableUsers.bind(kurirController));
router.get('/me', authenticate, kurirController.getByUserId.bind(kurirController));
router.post('/', authenticate, authorize('admin', 'dispatcher'), kurirController.create.bind(kurirController));
router.get('/:id', authenticate, kurirController.getById.bind(kurirController));
router.put('/:id', authenticate, authorize('admin', 'dispatcher'), kurirController.update.bind(kurirController));
router.delete('/:id', authenticate, authorize('admin'), kurirController.delete.bind(kurirController));
router.put('/:id/status', authenticate, kurirController.updateStatus.bind(kurirController));
router.get('/:id/performance', authenticate, kurirController.getPerformance.bind(kurirController));
router.put('/:id/performance', authenticate, kurirController.updatePerformance.bind(kurirController));

export default router;
