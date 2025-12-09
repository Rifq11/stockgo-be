import { Response } from 'express';
import { AuthRequest } from '../../middleware/auth.middleware';
import { sendSuccess, sendError } from '../../utils/response.util';
import { ProductService } from './product.service';
import { db } from '../../config/db';
import { category } from '../../../drizzle/schema';

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
      const { name, sku, category_id, description, unit, weight, dimensions, image_url } = req.body;

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
        image_url,
      });

      return sendSuccess(res, 'Product created successfully', newProduct, 201);
    } catch (error: any) {
      console.error('Create product error:', error);
      return sendError(res, 'Failed to create product', 500, error.message);
    }
  }

  async updateProduct(req: AuthRequest, res: Response) {
    try {
      const { id } = req.params;
      const { name, sku, category_id, description, unit, weight, dimensions, status, image_url } = req.body;

      if (!id) {
        return sendError(res, 'Product ID is required', 400);
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
        return sendError(res, 'Product not found', 404);
      }

      return sendSuccess(res, 'Product updated successfully', updatedProduct);
    } catch (error: any) {
      console.error('Update product error:', error);
      return sendError(res, 'Failed to update product', 500, error.message);
    }
  }

  async deleteProduct(req: AuthRequest, res: Response) {
    try {
      const { id } = req.params;

      if (!id) {
        return sendError(res, 'Product ID is required', 400);
      }

      const product = await productService.getProductById(parseInt(id));
      if (!product) {
        return sendError(res, 'Product not found', 404);
      }

      await productService.deleteProduct(parseInt(id));

      return sendSuccess(res, 'Product deleted successfully', { id: parseInt(id) });
    } catch (error: any) {
      console.error('Delete product error:', error);
      return sendError(res, 'Failed to delete product', 500, error.message);
    }
  }

  async getCategories(req: AuthRequest, res: Response) {
    try {
      const categories = await db
        .select()
        .from(category)
        .orderBy(category.name);

      return sendSuccess(res, 'Categories retrieved successfully', { categories });
    } catch (error: any) {
      console.error('Get categories error:', error);
      return sendError(res, 'Failed to get categories', 500, error.message);
    }
  }

  async uploadImage(req: AuthRequest, res: Response) {
    try {
      const file = req.file;
      if (!file) {
        return sendError(res, 'No file uploaded', 400);
      }

      // Get the relative path from uploads directory
      // file.path is like: /path/to/project/public/uploads/file/file-123.jpg
      // We need: /uploads/file/file-123.jpg
      const uploadsIndex = file.path.indexOf('uploads');
      const relativePath = uploadsIndex !== -1 
        ? '/' + file.path.substring(uploadsIndex).replace(/\\/g, '/')
        : `/uploads/${file.filename}`;
      
      return sendSuccess(res, 'Image uploaded successfully', {
        image_url: relativePath,
        file_name: file.filename,
        file_size: file.size,
      });
    } catch (error: any) {
      console.error('Upload image error:', error);
      return sendError(res, 'Failed to upload image', 500, error.message);
    }
  }
}

