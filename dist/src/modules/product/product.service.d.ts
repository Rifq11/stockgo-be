export declare class ProductService {
    getProductsWithImages(page?: number, limit?: number): Promise<any[]>;
    getProductById(productId: number): Promise<{
        category: string;
        created_at: Date;
        updated_at: Date;
        id: number;
        name: string;
        sku: string;
        barcode: string | null;
        image_url: string | null;
        description: string | null;
        category_id: number;
        unit: string;
        weight: string | null;
        dimensions: string | null;
        status: "available" | "out_of_stock" | "discontinued";
    } | null>;
    createProduct(data: {
        name: string;
        sku: string;
        category_id: number;
        description?: string;
        unit: string;
        weight?: number;
        dimensions?: string;
        image_url?: string;
    }): Promise<{
        created_at: Date;
        updated_at: Date;
        id: number;
        name: string;
        sku: string;
        barcode: string | null;
        image_url: string | null;
        description: string | null;
        category_id: number;
        unit: string;
        weight: string | null;
        dimensions: string | null;
        status: "available" | "out_of_stock" | "discontinued";
    } | undefined>;
    updateProduct(productId: number, data: {
        name?: string;
        sku?: string;
        category_id?: number;
        description?: string;
        unit?: string;
        weight?: number;
        dimensions?: string;
        status?: string;
        image_url?: string;
    }): Promise<{
        category: string;
        created_at: Date;
        updated_at: Date;
        id: number;
        name: string;
        sku: string;
        barcode: string | null;
        image_url: string | null;
        description: string | null;
        category_id: number;
        unit: string;
        weight: string | null;
        dimensions: string | null;
        status: "available" | "out_of_stock" | "discontinued";
    } | null>;
    deleteProduct(productId: number): Promise<{
        success: boolean;
    }>;
}
//# sourceMappingURL=product.service.d.ts.map