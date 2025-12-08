import { Response } from 'express';
import { AuthRequest } from '../../middleware/auth.middleware';
export declare class ExpeditionController {
    getAll(req: AuthRequest, res: Response): Promise<Response<any, Record<string, any>>>;
    getById(req: AuthRequest, res: Response): Promise<Response<any, Record<string, any>>>;
    create(req: AuthRequest, res: Response): Promise<Response<any, Record<string, any>>>;
    updateStatus(req: AuthRequest, res: Response): Promise<Response<any, Record<string, any>>>;
    getReport(req: AuthRequest, res: Response): Promise<Response<any, Record<string, any>>>;
}
//# sourceMappingURL=expedition.controller.d.ts.map