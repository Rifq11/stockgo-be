import { db } from '../../config/db';
import { product, category } from '../../../drizzle/schema';
import { eq } from 'drizzle-orm';

export class ProductService {
  async getProductsWithImages(page: number = 1, limit: number = 10) {
    const offset = (page - 1) * limit;

    const products = await db
      .select({
        product,
        category,
      })
      .from(product)
      .innerJoin(category, eq(product.category_id, category.id))
      .limit(limit)
      .offset(offset);

    return products.map((p: { product: any; category: any }) => ({
      ...p.product,
      category: p.category.name,
    }));
  }

  async getProductById(productId: number) {
    const [productData] = await db
      .select({
        product,
        category,
      })
      .from(product)
      .innerJoin(category, eq(product.category_id, category.id))
      .where(eq(product.id, productId))
      .limit(1);

    if (!productData) {
      return null;
    }

    return {
      ...productData.product,
      category: productData.category,
    };
  }

  async createProduct(data: {
    name: string;
    sku: string;
    category_id: number;
    description?: string;
    unit: string;
    weight?: number;
    dimensions?: string;
    image_url?: string;
  }) {
    await db
      .insert(product)
      .values({
        name: data.name,
        sku: data.sku,
        category_id: data.category_id,
        description: data.description,
        unit: data.unit,
        weight: data.weight?.toString(),
        dimensions: data.dimensions,
        status: 'available',
        image_url: data.image_url,
      });

    const [created] = await db
      .select()
      .from(product)
      .where(eq(product.sku, data.sku))
      .limit(1);

    return created;
  }

  async updateProduct(productId: number, data: {
    name?: string;
    sku?: string;
    category_id?: number;
    description?: string;
    unit?: string;
    weight?: number;
    dimensions?: string;
    status?: string;
    image_url?: string;
  }) {
    const updateData: any = {};
    
    if (data.name !== undefined) updateData.name = data.name;
    if (data.sku !== undefined) updateData.sku = data.sku;
    if (data.category_id !== undefined) updateData.category_id = data.category_id;
    if (data.description !== undefined) updateData.description = data.description;
    if (data.unit !== undefined) updateData.unit = data.unit;
    if (data.weight !== undefined) updateData.weight = data.weight.toString();
    if (data.dimensions !== undefined) updateData.dimensions = data.dimensions;
    if (data.status !== undefined) updateData.status = data.status as any;
    if (data.image_url !== undefined) updateData.image_url = data.image_url;

    await db
      .update(product)
      .set(updateData)
      .where(eq(product.id, productId));

    return this.getProductById(productId);
  }

  async deleteProduct(productId: number) {
    await db
      .delete(product)
      .where(eq(product.id, productId));

    return { success: true };
  }
}

