import { Response } from 'express';
import { AuthRequest } from '../../middleware/auth.middleware';
export declare class ReportController {
    getDeliveryReport(req: AuthRequest, res: Response): Promise<Response<any, Record<string, any>>>;
    getKurirReport(req: AuthRequest, res: Response): Promise<Response<any, Record<string, any>>>;
    getProductReport(req: AuthRequest, res: Response): Promise<Response<any, Record<string, any>>>;
    getWarehouseReport(req: AuthRequest, res: Response): Promise<Response<any, Record<string, any>>>;
}
//# sourceMappingURL=report.controller.d.ts.map