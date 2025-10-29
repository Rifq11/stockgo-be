import { Router } from 'express';
import { CustomerController } from './customer.controller';
import { authenticate, authorize } from '../../middleware/auth.middleware';

const router = Router();
const customerController = new CustomerController();

router.post('/', authenticate, authorize('admin', 'dispatcher'), customerController.createCustomer.bind(customerController));
router.get('/', authenticate, customerController.getCustomers.bind(customerController));
router.get('/:id', authenticate, customerController.getCustomerById.bind(customerController));
router.put('/:id', authenticate, authorize('admin', 'dispatcher'), customerController.updateCustomer.bind(customerController));
router.delete('/:id', authenticate, authorize('admin'), customerController.deleteCustomer.bind(customerController));

export default router;

