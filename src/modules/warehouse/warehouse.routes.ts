import { Router } from 'express';
import { WarehouseController } from './warehouse.controller';

const router = Router();
const warehouseController = new WarehouseController();

router.get('/', warehouseController.getAll.bind(warehouseController));
router.get('/:id', warehouseController.getById.bind(warehouseController));
router.post('/', warehouseController.create.bind(warehouseController));
router.put('/:id', warehouseController.update.bind(warehouseController));
router.delete('/:id', warehouseController.delete.bind(warehouseController));

export default router;
