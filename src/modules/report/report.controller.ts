import { Response } from 'express';
import { AuthRequest } from '../../middleware/auth.middleware';
import { sendSuccess, sendError } from '../../utils/response.util';
import { ReportService } from './report.service';

const reportService = new ReportService();

export class ReportController {
  async getDeliveryReport(req: AuthRequest, res: Response) {
    try {
      const { start_date, end_date, warehouse_id } = req.query;

      const report = await reportService.getDeliveryReport(
        start_date as string,
        end_date as string,
        warehouse_id ? parseInt(warehouse_id as string) : undefined
      );

      return sendSuccess(res, 'Delivery report retrieved successfully', report);
    } catch (error: any) {
      console.error('Get delivery report error:', error);
      return sendError(res, 'Failed to get delivery report', 500, error.message);
    }
  }

  async getKurirReport(req: AuthRequest, res: Response) {
    try {
      const { start_date, end_date, kurir_id } = req.query;

      const report = await reportService.getKurirReport(
        start_date as string,
        end_date as string,
        kurir_id ? parseInt(kurir_id as string) : undefined
      );

      return sendSuccess(res, 'Kurir report retrieved successfully', report);
    } catch (error: any) {
      console.error('Get kurir report error:', error);
      return sendError(res, 'Failed to get kurir report', 500, error.message);
    }
  }

  async getProductReport(req: AuthRequest, res: Response) {
    try {
      const { start_date, end_date, warehouse_id, category_id } = req.query;

      const report = await reportService.getProductReport(
        start_date as string,
        end_date as string,
        warehouse_id ? parseInt(warehouse_id as string) : undefined,
        category_id ? parseInt(category_id as string) : undefined
      );

      return sendSuccess(res, 'Product report retrieved successfully', report);
    } catch (error: any) {
      console.error('Get product report error:', error);
      return sendError(res, 'Failed to get product report', 500, error.message);
    }
  }

  async getWarehouseReport(req: AuthRequest, res: Response) {
    try {
      const { start_date, end_date, warehouse_id } = req.query;

      const report = await reportService.getWarehouseReport(
        start_date as string,
        end_date as string,
        warehouse_id ? parseInt(warehouse_id as string) : undefined
      );

      return sendSuccess(res, 'Warehouse report retrieved successfully', report);
    } catch (error: any) {
      console.error('Get warehouse report error:', error);
      return sendError(res, 'Failed to get warehouse report', 500, error.message);
    }
  }
}

