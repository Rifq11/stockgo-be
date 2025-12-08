"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const customer_controller_1 = require("./customer.controller");
const auth_middleware_1 = require("../../middleware/auth.middleware");
const router = (0, express_1.Router)();
const customerController = new customer_controller_1.CustomerController();
router.post('/', auth_middleware_1.authenticate, (0, auth_middleware_1.authorize)('admin', 'dispatcher'), customerController.createCustomer.bind(customerController));
router.get('/', auth_middleware_1.authenticate, customerController.getCustomers.bind(customerController));
router.get('/:id', auth_middleware_1.authenticate, customerController.getCustomerById.bind(customerController));
router.put('/:id', auth_middleware_1.authenticate, (0, auth_middleware_1.authorize)('admin', 'dispatcher'), customerController.updateCustomer.bind(customerController));
router.delete('/:id', auth_middleware_1.authenticate, (0, auth_middleware_1.authorize)('admin'), customerController.deleteCustomer.bind(customerController));
exports.default = router;
//# sourceMappingURL=customer.routes.js.map