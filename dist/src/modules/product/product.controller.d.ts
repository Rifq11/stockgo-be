import { Response } from 'express';
import { AuthRequest } from '../../middleware/auth.middleware';
export declare class ProductController {
    getProducts(req: AuthRequest, res: Response): Promise<Response<any, Record<string, any>>>;
    getProductById(req: AuthRequest, res: Response): Promise<Response<any, Record<string, any>>>;
    createProduct(req: AuthRequest, res: Response): Promise<Response<any, Record<string, any>>>;
    updateProduct(req: AuthRequest, res: Response): Promise<Response<any, Record<string, any>>>;
    deleteProduct(req: AuthRequest, res: Response): Promise<Response<any, Record<string, any>>>;
    getCategories(req: AuthRequest, res: Response): Promise<Response<any, Record<string, any>>>;
}
//# sourceMappingURL=product.controller.d.ts.map