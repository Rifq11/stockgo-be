"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const product_controller_1 = require("./product.controller");
const auth_middleware_1 = require("../../middleware/auth.middleware");
const upload_middleware_1 = require("../../middleware/upload.middleware");
const router = (0, express_1.Router)();
const productController = new product_controller_1.ProductController();
router.get('/categories', auth_middleware_1.authenticate, productController.getCategories.bind(productController));
router.post('/upload-image', auth_middleware_1.authenticate, (0, auth_middleware_1.authorize)('admin'), upload_middleware_1.uploadSingle, productController.uploadImage.bind(productController));
router.get('/', auth_middleware_1.authenticate, productController.getProducts.bind(productController));
router.post('/', auth_middleware_1.authenticate, (0, auth_middleware_1.authorize)('admin'), productController.createProduct.bind(productController));
router.get('/:id', auth_middleware_1.authenticate, productController.getProductById.bind(productController));
router.put('/:id', auth_middleware_1.authenticate, (0, auth_middleware_1.authorize)('admin'), productController.updateProduct.bind(productController));
router.delete('/:id', auth_middleware_1.authenticate, (0, auth_middleware_1.authorize)('admin'), productController.deleteProduct.bind(productController));
exports.default = router;
//# sourceMappingURL=product.routes.js.map