import { Response } from 'express';
import { AuthRequest } from '../../middleware/auth.middleware';
export declare class DeliveryController {
    createDelivery(req: AuthRequest, res: Response): Promise<Response<any, Record<string, any>>>;
    getDeliveries(req: AuthRequest, res: Response): Promise<Response<any, Record<string, any>>>;
    getDeliveryByTracking(req: AuthRequest, res: Response): Promise<Response<any, Record<string, any>>>;
    getDeliveryById(req: AuthRequest, res: Response): Promise<Response<any, Record<string, any>>>;
    updateDeliveryStatus(req: AuthRequest, res: Response): Promise<Response<any, Record<string, any>>>;
    assignKurir(req: AuthRequest, res: Response): Promise<Response<any, Record<string, any>>>;
    updateDelivery(req: AuthRequest, res: Response): Promise<Response<any, Record<string, any>>>;
    cancelDelivery(req: AuthRequest, res: Response): Promise<Response<any, Record<string, any>>>;
}
//# sourceMappingURL=delivery.controller.d.ts.map