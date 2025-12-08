import { Response } from 'express';
import { AuthRequest } from '../../middleware/auth.middleware';
export declare class KurirController {
    getAll(req: AuthRequest, res: Response): Promise<Response<any, Record<string, any>>>;
    getById(req: AuthRequest, res: Response): Promise<Response<any, Record<string, any>>>;
    updateStatus(req: AuthRequest, res: Response): Promise<Response<any, Record<string, any>>>;
    getPerformance(req: AuthRequest, res: Response): Promise<Response<any, Record<string, any>>>;
    updatePerformance(req: AuthRequest, res: Response): Promise<Response<any, Record<string, any>>>;
    getByUserId(req: AuthRequest, res: Response): Promise<Response<any, Record<string, any>>>;
    create(req: AuthRequest, res: Response): Promise<Response<any, Record<string, any>>>;
    update(req: AuthRequest, res: Response): Promise<Response<any, Record<string, any>>>;
}
//# sourceMappingURL=kurir.controller.d.ts.map