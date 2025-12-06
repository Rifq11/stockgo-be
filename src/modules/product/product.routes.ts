import { Router } from 'express';
import { ProductController } from './product.controller';
import { authenticate, authorize } from '../../middleware/auth.middleware';
import { uploadSingle } from '../../middleware/upload.middleware';

const router = Router();
const productController = new ProductController();

router.get('/categories', authenticate, productController.getCategories.bind(productController));
router.get('/', authenticate, productController.getProducts.bind(productController));
router.post('/', authenticate, authorize('admin'), productController.createProduct.bind(productController));
router.post('/image', authenticate, authorize('admin'), uploadSingle, productController.addProductImage.bind(productController));
router.get('/:id', authenticate, productController.getProductById.bind(productController));
router.put('/:id', authenticate, authorize('admin'), productController.updateProduct.bind(productController));
router.delete('/:id', authenticate, authorize('admin'), productController.deleteProduct.bind(productController));

export default router;

