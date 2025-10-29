import { db } from '../../config/db';
import { product, productImage, category } from '../../../drizzle/schema';
import { eq, and } from 'drizzle-orm';

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

    const productsWithImages = await Promise.all(
      products.map(async (p: { product: any; category: any }) => {
      const images = await db
        .select()
        .from(productImage)
        .where(eq(productImage.product_id, p.product.id))
        .orderBy(productImage.is_primary);

        return {
          ...p.product,
          category: p.category.name,
          images: images.map((img: { image_url: string; api_url?: string | null }) => ({
            ...img,
            image_url: img.api_url || `/api/media/serve/product/${img.image_url.split('/').pop()}`
          })),
        };
      })
    );

    return productsWithImages;
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

    const images = await db
      .select()
      .from(productImage)
      .where(eq(productImage.product_id, productId))
      .orderBy(productImage.is_primary);

    return {
      ...productData.product,
      category: productData.category,
      images: images.map((img: { image_url: string; api_url?: string | null }) => ({
        ...img,
        image_url: img.api_url || `/api/media/serve/product/${img.image_url.split('/').pop()}`
      })),
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
      });

    const [created] = await db
      .select()
      .from(product)
      .where(eq(product.sku, data.sku))
      .limit(1);

    return created;
  }

  async addProductImage(productId: number, imageUrl: string, apiUrl?: string, isPrimary: boolean = false) {
    const apiUrlValue = apiUrl || `/api/media/serve/product/${imageUrl.split('/').pop()}`;
    
    await db
      .insert(productImage)
      .values({
        product_id: productId,
        image_url: imageUrl,
        api_url: apiUrlValue,
        is_primary: isPrimary,
      });

    const [created] = await db
      .select()
      .from(productImage)
      .where(eq(productImage.image_url, imageUrl))
      .limit(1);

    return created;
  }
}

