import { Response } from 'express';
import { AuthRequest } from '../../middleware/auth.middleware';
export declare class WarehouseController {
    getAll(req: AuthRequest, res: Response): Promise<Response<any, Record<string, any>>>;
    getById(req: AuthRequest, res: Response): Promise<Response<any, Record<string, any>>>;
    create(req: AuthRequest, res: Response): Promise<Response<any, Record<string, any>>>;
    update(req: AuthRequest, res: Response): Promise<Response<any, Record<string, any>>>;
    delete(req: AuthRequest, res: Response): Promise<Response<any, Record<string, any>>>;
}
//# sourceMappingURL=warehouse.controller.d.ts.map