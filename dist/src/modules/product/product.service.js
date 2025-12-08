"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductService = void 0;
const db_1 = require("../../config/db");
const schema_1 = require("../../../drizzle/schema");
const drizzle_orm_1 = require("drizzle-orm");
class ProductService {
    async getProductsWithImages(page = 1, limit = 10) {
        const offset = (page - 1) * limit;
        const products = await db_1.db
            .select({
            product: schema_1.product,
            category: schema_1.category,
        })
            .from(schema_1.product)
            .innerJoin(schema_1.category, (0, drizzle_orm_1.eq)(schema_1.product.category_id, schema_1.category.id))
            .limit(limit)
            .offset(offset);
        return products.map((p) => ({
            ...p.product,
            category: p.category.name,
        }));
    }
    async getProductById(productId) {
        const [productData] = await db_1.db
            .select({
            product: schema_1.product,
            category: schema_1.category,
        })
            .from(schema_1.product)
            .innerJoin(schema_1.category, (0, drizzle_orm_1.eq)(schema_1.product.category_id, schema_1.category.id))
            .where((0, drizzle_orm_1.eq)(schema_1.product.id, productId))
            .limit(1);
        if (!productData) {
            return null;
        }
        return {
            ...productData.product,
            category: productData.category.name,
        };
    }
    async createProduct(data) {
        await db_1.db
            .insert(schema_1.product)
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
        const [created] = await db_1.db
            .select()
            .from(schema_1.product)
            .where((0, drizzle_orm_1.eq)(schema_1.product.sku, data.sku))
            .limit(1);
        return created;
    }
    async updateProduct(productId, data) {
        const updateData = {};
        if (data.name !== undefined)
            updateData.name = data.name;
        if (data.sku !== undefined)
            updateData.sku = data.sku;
        if (data.category_id !== undefined)
            updateData.category_id = data.category_id;
        if (data.description !== undefined)
            updateData.description = data.description;
        if (data.unit !== undefined)
            updateData.unit = data.unit;
        if (data.weight !== undefined)
            updateData.weight = data.weight.toString();
        if (data.dimensions !== undefined)
            updateData.dimensions = data.dimensions;
        if (data.status !== undefined)
            updateData.status = data.status;
        if (data.image_url !== undefined)
            updateData.image_url = data.image_url;
        await db_1.db
            .update(schema_1.product)
            .set(updateData)
            .where((0, drizzle_orm_1.eq)(schema_1.product.id, productId));
        return this.getProductById(productId);
    }
    async deleteProduct(productId) {
        await db_1.db
            .delete(schema_1.product)
            .where((0, drizzle_orm_1.eq)(schema_1.product.id, productId));
        return { success: true };
    }
}
exports.ProductService = ProductService;
//# sourceMappingURL=product.service.js.map