import { Response } from 'express';
import { AuthRequest } from '../../middleware/auth.middleware';
export declare class UploadController {
    upload(req: AuthRequest, res: Response): Promise<Response<any, Record<string, any>>>;
    list(req: AuthRequest, res: Response): Promise<Response<any, Record<string, any>>>;
    getById(req: AuthRequest, res: Response): Promise<Response<any, Record<string, any>>>;
    delete(req: AuthRequest, res: Response): Promise<Response<any, Record<string, any>>>;
}
//# sourceMappingURL=upload.controller.d.ts.map