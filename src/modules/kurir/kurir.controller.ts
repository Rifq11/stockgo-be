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

  async updatePerformance(req: AuthRequest, res: Response) {
    try {
      const { id } = req.params;
      const { rating } = req.body;

      if (!id) {
        return sendError(res, 'Kurir ID is required', 400);
      }

      if (rating === undefined || rating === null) {
        return sendError(res, 'Rating is required', 400);
      }

      const ratingNum = parseFloat(rating);
      if (isNaN(ratingNum)) {
        return sendError(res, 'Rating must be a valid number', 400);
      }

      const updatedKurir = await kurirService.updateKurirRating(parseInt(id), ratingNum);

      if (!updatedKurir) {
        return sendError(res, 'Kurir not found', 404);
      }

      return sendSuccess(res, 'Kurir rating updated successfully', updatedKurir);
    } catch (error: any) {
      console.error('Update kurir performance error:', error);
      return sendError(res, error.message || 'Failed to update kurir rating', 500, error.message);
    }
  }

  async getMyProfile(req: AuthRequest, res: Response) {
    try {
      if (!req.user) {
        return sendError(res, 'Not authenticated', 401);
      }

      const kurirProfile = await kurirService.getKurirByUserId(req.user.id);

      return sendSuccess(res, 'Kurir profile retrieved successfully', kurirProfile);
    } catch (error: any) {
      console.error('Get kurir profile error:', error);
      return sendError(res, 'Failed to fetch kurir profile', 500, error.message);
    }
  }

  async createOrUpdateProfile(req: AuthRequest, res: Response) {
    try {
      if (!req.user) {
        return sendError(res, 'Not authenticated', 401);
      }

      const { employee_id, license_number, vehicle_type, vehicle_plate, max_capacity } = req.body;

      if (!employee_id) {
        return sendError(res, 'Employee ID is required', 400);
      }

      const kurirProfile = await kurirService.createOrUpdateKurirProfile(req.user.id, {
        employee_id,
        license_number,
        vehicle_type,
        vehicle_plate,
        max_capacity: max_capacity ? parseFloat(max_capacity) : undefined,
      });

      return sendSuccess(res, 'Kurir profile updated successfully', kurirProfile);
    } catch (error: any) {
      console.error('Create/update kurir profile error:', error);
      return sendError(res, error.message || 'Failed to update kurir profile', 500, error.message);
    }
  }
}
