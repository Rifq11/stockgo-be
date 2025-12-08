import { Response } from 'express';
import { AuthRequest } from '../../middleware/auth.middleware';
export declare class DashboardController {
    getDashboardStats(req: AuthRequest, res: Response): Promise<Response<any, Record<string, any>>>;
    getDeliveryAnalytics(req: AuthRequest, res: Response): Promise<Response<any, Record<string, any>>>;
    getKurirPerformance(req: AuthRequest, res: Response): Promise<Response<any, Record<string, any>>>;
    getWarehouseStats(req: AuthRequest, res: Response): Promise<Response<any, Record<string, any>>>;
}
//# sourceMappingURL=dashboard.controller.d.ts.map