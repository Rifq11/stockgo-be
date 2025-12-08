import { Router } from 'express';
import { KurirController } from './kurir.controller';

const router = Router();
const kurirController = new KurirController();

router.get('/', kurirController.getAll.bind(kurirController));
router.get('/me', kurirController.getByUserId.bind(kurirController));
router.post('/', kurirController.create.bind(kurirController));
router.get('/:id', kurirController.getById.bind(kurirController));
router.put('/:id', kurirController.update.bind(kurirController));
router.put('/:id/status', kurirController.updateStatus.bind(kurirController));
router.get('/:id/performance', kurirController.getPerformance.bind(kurirController));
router.put('/:id/performance', kurirController.updatePerformance.bind(kurirController));

export default router;
