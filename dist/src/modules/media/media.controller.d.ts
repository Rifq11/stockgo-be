import { Response } from 'express';
import { AuthRequest } from '../../middleware/auth.middleware';
export declare class MediaController {
    uploadDeliveryMedia(req: AuthRequest, res: Response): Promise<Response<any, Record<string, any>>>;
    getDeliveryMedia(req: AuthRequest, res: Response): Promise<Response<any, Record<string, any>>>;
    deleteMedia(req: AuthRequest, res: Response): Promise<Response<any, Record<string, any>>>;
    serveMedia(req: AuthRequest, res: Response): Promise<Response<any, Record<string, any>>>;
}
//# sourceMappingURL=media.controller.d.ts.map