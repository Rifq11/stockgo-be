import { Response } from 'express';
import { AuthRequest } from '../../middleware/auth.middleware';
import { sendSuccess, sendError } from '../../utils/response.util';
import { DashboardService } from './dashboard.service';

const dashboardService = new DashboardService();

export class DashboardController {
  async getDashboardStats(req: AuthRequest, res: Response) {
    try {
      const { warehouse_id, start_date, end_date } = req.query;

      const stats = await dashboardService.getDashboardStats(
        warehouse_id ? parseInt(warehouse_id as string) : undefined,
        start_date as string,
        end_date as string
      );

      return sendSuccess(res, 'Dashboard stats retrieved successfully', stats);
    } catch (error: any) {
      console.error('Get dashboard stats error:', error);
      return sendError(res, 'Failed to get dashboard stats', 500, error.message);
    }
  }

  async getDeliveryAnalytics(req: AuthRequest, res: Response) {
    try {
      const { warehouse_id, start_date, end_date } = req.query;

      const analytics = await dashboardService.getDeliveryAnalytics(
        warehouse_id ? parseInt(warehouse_id as string) : undefined,
        start_date as string,
        end_date as string
      );

      return sendSuccess(res, 'Delivery analytics retrieved successfully', analytics);
    } catch (error: any) {
      console.error('Get delivery analytics error:', error);
      return sendError(res, 'Failed to get delivery analytics', 500, error.message);
    }
  }

  async getKurirPerformance(req: AuthRequest, res: Response) {
    try {
      const { start_date, end_date } = req.query;

      const performance = await dashboardService.getKurirPerformance(
        start_date as string,
        end_date as string
      );

      return sendSuccess(res, 'Kurir performance retrieved successfully', performance);
    } catch (error: any) {
      console.error('Get kurir performance error:', error);
      return sendError(res, 'Failed to get kurir performance', 500, error.message);
    }
  }

  async getWarehouseStats(req: AuthRequest, res: Response) {
    try {
      const stats = await dashboardService.getWarehouseStats();
      return sendSuccess(res, 'Warehouse stats retrieved successfully', stats);
    } catch (error: any) {
      console.error('Get warehouse stats error:', error);
      return sendError(res, 'Failed to get warehouse stats', 500, error.message);
    }
  }
}

