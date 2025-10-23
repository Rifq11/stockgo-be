import { Router } from 'express';
import { ExpeditionController } from './expedition.controller';

const router = Router();
const expeditionController = new ExpeditionController();

router.get('/', expeditionController.getAll.bind(expeditionController));
router.get('/:id', expeditionController.getById.bind(expeditionController));
router.post('/', expeditionController.create.bind(expeditionController));
router.put('/:id/status', expeditionController.updateStatus.bind(expeditionController));
router.get('/reports/summary', expeditionController.getReport.bind(expeditionController));

export default router;
