import { Response } from 'express';
import { AuthRequest } from '../../middleware/auth.middleware';
import { sendSuccess, sendError } from '../../utils/response.util';
import { ProductService } from './product.service';

const productService = new ProductService();

export class ProductController {
  async getProducts(req: AuthRequest, res: Response) {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;

      const products = await productService.getProductsWithImages(page, limit);

      return sendSuccess(res, 'Products retrieved successfully', {
        products,
        pagination: {
          page,
          limit,
        },
      });
    } catch (error: any) {
      console.error('Get products error:', error);
      return sendError(res, 'Failed to get products', 500, error.message);
    }
  }

  async getProductById(req: AuthRequest, res: Response) {
    try {
      const { id } = req.params;
      if (!id) {
        return sendError(res, 'Product ID is required', 400);
      }

      const product = await productService.getProductById(parseInt(id));

      if (!product) {
        return sendError(res, 'Product not found', 404);
      }

      return sendSuccess(res, 'Product retrieved successfully', product);
    } catch (error: any) {
      console.error('Get product error:', error);
      return sendError(res, 'Failed to get product', 500, error.message);
    }
  }

  async createProduct(req: AuthRequest, res: Response) {
    try {
      const { name, sku, category_id, description, unit, weight, dimensions } = req.body;

      if (!name || !sku || !category_id || !unit) {
        return sendError(res, 'Name, SKU, category, and unit are required', 400);
      }

      const newProduct = await productService.createProduct({
        name,
        sku,
        category_id,
        description,
        unit,
        weight,
        dimensions,
      });

      return sendSuccess(res, 'Product created successfully', newProduct, 201);
    } catch (error: any) {
      console.error('Create product error:', error);
      return sendError(res, 'Failed to create product', 500, error.message);
    }
  }

  async addProductImage(req: AuthRequest, res: Response) {
    try {
      const { product_id, api_url } = req.body;
      const file = req.file;

      if (!product_id || !file) {
        return sendError(res, 'Product ID and file are required', 400);
      }

      const finalApiUrl = api_url || `/api/media/serve/product/${file.filename}`;

      const newImage = await productService.addProductImage(product_id, file.path, finalApiUrl);

      return sendSuccess(res, 'Product image added successfully', newImage, 201);
    } catch (error: any) {
      console.error('Add product image error:', error);
      return sendError(res, 'Failed to add product image', 500, error.message);
    }
  }
}

