import { Response } from 'express';
import { AuthRequest } from '../../middleware/auth.middleware';
import { sendSuccess, sendError } from '../../utils/response.util';
import { KurirService } from './kurir.service';

const kurirService = new KurirService();

export class KurirController {
  async getAll(req: AuthRequest, res: Response) {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;

      const kurirs = await kurirService.getKurirs(page, limit);

      return sendSuccess(res, 'Kurirs retrieved successfully', {
        kurirs,
        pagination: {
          page,
          limit,
        },
      });
    } catch (error: any) {
      console.error('Get kurirs error:', error);
      return sendError(res, 'Failed to fetch kurirs', 500, error.message);
    }
  }

  async getById(req: AuthRequest, res: Response) {
    try {
      const { id } = req.params;

      if (!id) {
        return sendError(res, 'Kurir ID is required', 400);
      }

      const kurir = await kurirService.getKurirById(parseInt(id));

      if (!kurir) {
        return sendError(res, 'Kurir not found', 404);
      }

      return sendSuccess(res, 'Kurir retrieved successfully', kurir);
    } catch (error: any) {
      console.error('Get kurir error:', error);
      return sendError(res, 'Failed to fetch kurir', 500, error.message);
    }
  }

  async updateStatus(req: AuthRequest, res: Response) {
    try {
      const { id } = req.params;
      const { status, location } = req.body;

      if (!id || !status) {
        return sendError(res, 'Kurir ID and status are required', 400);
      }

      const kurir = await kurirService.updateKurirStatus(parseInt(id), status, location);

      return sendSuccess(res, 'Kurir status updated successfully', kurir);
    } catch (error: any) {
      console.error('Update kurir status error:', error);
      return sendError(res, 'Failed to update kurir status', 500, error.message);
    }
  }

  async getPerformance(req: AuthRequest, res: Response) {
    try {
      const { id } = req.params;

      if (!id) {
        return sendError(res, 'Kurir ID is required', 400);
      }

      const performance = await kurirService.getKurirPerformance(parseInt(id));

      if (!performance) {
        return sendError(res, 'Kurir not found', 404);
      }

      return sendSuccess(res, 'Kurir performance retrieved successfully', performance);
    } catch (error: any) {
      console.error('Get kurir performance error:', error);
      return sendError(res, 'Failed to fetch kurir performance', 500, error.message);
    }
  }
}
