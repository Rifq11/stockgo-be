"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const warehouse_controller_1 = require("./warehouse.controller");
const router = (0, express_1.Router)();
const warehouseController = new warehouse_controller_1.WarehouseController();
router.get('/', warehouseController.getAll.bind(warehouseController));
router.get('/:id', warehouseController.getById.bind(warehouseController));
router.post('/', warehouseController.create.bind(warehouseController));
router.put('/:id', warehouseController.update.bind(warehouseController));
router.delete('/:id', warehouseController.delete.bind(warehouseController));
exports.default = router;
//# sourceMappingURL=warehouse.routes.js.map