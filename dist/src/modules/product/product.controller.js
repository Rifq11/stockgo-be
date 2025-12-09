"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductController = void 0;
const response_util_1 = require("../../utils/response.util");
const product_service_1 = require("./product.service");
const db_1 = require("../../config/db");
const schema_1 = require("../../../drizzle/schema");
const productService = new product_service_1.ProductService();
class ProductController {
    async getProducts(req, res) {
        try {
            const page = parseInt(req.query.page) || 1;
            const limit = parseInt(req.query.limit) || 10;
            const products = await productService.getProductsWithImages(page, limit);
            return (0, response_util_1.sendSuccess)(res, 'Products retrieved successfully', {
                products,
                pagination: {
                    page,
                    limit,
                },
            });
        }
        catch (error) {
            console.error('Get products error:', error);
            return (0, response_util_1.sendError)(res, 'Failed to get products', 500, error.message);
        }
    }
    async getProductById(req, res) {
        try {
            const { id } = req.params;
            if (!id) {
                return (0, response_util_1.sendError)(res, 'Product ID is required', 400);
            }
            const product = await productService.getProductById(parseInt(id));
            if (!product) {
                return (0, response_util_1.sendError)(res, 'Product not found', 404);
            }
            return (0, response_util_1.sendSuccess)(res, 'Product retrieved successfully', product);
        }
        catch (error) {
            console.error('Get product error:', error);
            return (0, response_util_1.sendError)(res, 'Failed to get product', 500, error.message);
        }
    }
    async createProduct(req, res) {
        try {
            const { name, sku, category_id, description, unit, weight, dimensions, image_url } = req.body;
            if (!name || !sku || !category_id || !unit) {
                return (0, response_util_1.sendError)(res, 'Name, SKU, category, and unit are required', 400);
            }
            const newProduct = await productService.createProduct({
                name,
                sku,
                category_id,
                description,
                unit,
                weight,
                dimensions,
                image_url,
            });
            return (0, response_util_1.sendSuccess)(res, 'Product created successfully', newProduct, 201);
        }
        catch (error) {
            console.error('Create product error:', error);
            return (0, response_util_1.sendError)(res, 'Failed to create product', 500, error.message);
        }
    }
    async updateProduct(req, res) {
        try {
            const { id } = req.params;
            const { name, sku, category_id, description, unit, weight, dimensions, status, image_url } = req.body;
            if (!id) {
                return (0, response_util_1.sendError)(res, 'Product ID is required', 400);
            }
            const updatedProduct = await productService.updateProduct(parseInt(id), {
                name,
                sku,
                category_id,
                description,
                unit,
                weight,
                dimensions,
                status,
                image_url,
            });
            if (!updatedProduct) {
                return (0, response_util_1.sendError)(res, 'Product not found', 404);
            }
            return (0, response_util_1.sendSuccess)(res, 'Product updated successfully', updatedProduct);
        }
        catch (error) {
            console.error('Update product error:', error);
            return (0, response_util_1.sendError)(res, 'Failed to update product', 500, error.message);
        }
    }
    async deleteProduct(req, res) {
        try {
            const { id } = req.params;
            if (!id) {
                return (0, response_util_1.sendError)(res, 'Product ID is required', 400);
            }
            const product = await productService.getProductById(parseInt(id));
            if (!product) {
                return (0, response_util_1.sendError)(res, 'Product not found', 404);
            }
            await productService.deleteProduct(parseInt(id));
            return (0, response_util_1.sendSuccess)(res, 'Product deleted successfully', { id: parseInt(id) });
        }
        catch (error) {
            console.error('Delete product error:', error);
            return (0, response_util_1.sendError)(res, 'Failed to delete product', 500, error.message);
        }
    }
    async getCategories(req, res) {
        try {
            const categories = await db_1.db
                .select()
                .from(schema_1.category)
                .orderBy(schema_1.category.name);
            return (0, response_util_1.sendSuccess)(res, 'Categories retrieved successfully', { categories });
        }
        catch (error) {
            console.error('Get categories error:', error);
            return (0, response_util_1.sendError)(res, 'Failed to get categories', 500, error.message);
        }
    }
    async uploadImage(req, res) {
        try {
            const file = req.file;
            if (!file) {
                return (0, response_util_1.sendError)(res, 'No file uploaded', 400);
            }
            const uploadsIndex = file.path.indexOf('uploads');
            const relativePath = uploadsIndex !== -1
                ? '/' + file.path.substring(uploadsIndex).replace(/\\/g, '/')
                : `/uploads/${file.filename}`;
            return (0, response_util_1.sendSuccess)(res, 'Image uploaded successfully', {
                image_url: relativePath,
                file_name: file.filename,
                file_size: file.size,
            });
        }
        catch (error) {
            console.error('Upload image error:', error);
            return (0, response_util_1.sendError)(res, 'Failed to upload image', 500, error.message);
        }
    }
}
exports.ProductController = ProductController;
//# sourceMappingURL=product.controller.js.map