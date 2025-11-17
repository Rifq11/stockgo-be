import { Router } from 'express';
import { ProductController } from './product.controller';
import { authenticate, authorize } from '../../middleware/auth.middleware';
import { uploadSingle } from '../../middleware/upload.middleware';

const router = Router();
const productController = new ProductController();

router.get('/', authenticate, productController.getProducts.bind(productController));
router.post('/', authenticate, authorize('admin'), productController.createProduct.bind(productController));
router.post('/image', authenticate, authorize('admin'), uploadSingle, productController.addProductImage.bind(productController));
router.get('/:id', authenticate, productController.getProductById.bind(productController));

export default router;

