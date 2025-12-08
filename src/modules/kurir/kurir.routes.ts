import { Router } from 'express';
import { KurirController } from './kurir.controller';
import { authenticate, authorize } from '../../middleware/auth.middleware';

const router = Router();
const kurirController = new KurirController();

router.get('/', kurirController.getAll.bind(kurirController));
router.get('/:id', kurirController.getById.bind(kurirController));
router.put('/:id/status', kurirController.updateStatus.bind(kurirController));
router.get('/:id/performance', kurirController.getPerformance.bind(kurirController));
router.put('/:id/performance', kurirController.updatePerformance.bind(kurirController));

// Profile endpoints for authenticated kurir users
router.get('/profile/me', authenticate, authorize('kurir'), kurirController.getMyProfile.bind(kurirController));
router.post('/profile/me', authenticate, authorize('kurir'), kurirController.createOrUpdateProfile.bind(kurirController));
router.put('/profile/me', authenticate, authorize('kurir'), kurirController.createOrUpdateProfile.bind(kurirController));

export default router;
