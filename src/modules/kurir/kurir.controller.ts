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

  async getByUserId(req: AuthRequest, res: Response) {
    try {
      const userId = req.user?.id;
      if (!userId) {
        return sendError(res, 'User ID is required', 400);
      }

      const kurirData = await kurirService.getKurirByUserId(userId);

      if (!kurirData) {
        return sendError(res, 'Kurir profile not found', 404);
      }

      return sendSuccess(res, 'Kurir retrieved successfully', kurirData);
    } catch (error: any) {
      console.error('Get kurir by user ID error:', error);
      return sendError(res, 'Failed to fetch kurir', 500, error.message);
    }
  }

  async create(req: AuthRequest, res: Response) {
    try {
      // Allow admin to specify user_id, otherwise use current user
      const userId = req.body.user_id ? parseInt(req.body.user_id) : req.user?.id;
      if (!userId) {
        return sendError(res, 'User ID is required', 400);
      }

      const { license_number, vehicle_type, vehicle_plate, current_location, max_capacity } = req.body;

      const newKurir = await kurirService.createKurir(userId, {
        license_number,
        vehicle_type,
        vehicle_plate,
        current_location,
        max_capacity,
      });

      if (!newKurir) {
        return sendError(res, 'Failed to create kurir profile', 500);
      }

      return sendSuccess(res, 'Kurir profile created successfully', newKurir);
    } catch (error: any) {
      console.error('Create kurir error:', error);
      return sendError(res, error.message || 'Failed to create kurir profile', 500, error.message);
    }
  }

  async update(req: AuthRequest, res: Response) {
    try {
      const { id } = req.params;
      const { license_number, vehicle_type, vehicle_plate, current_location, max_capacity } = req.body;

      if (!id) {
        return sendError(res, 'Kurir ID is required', 400);
      }

      const updatedKurir = await kurirService.updateKurir(parseInt(id), {
        license_number,
        vehicle_type,
        vehicle_plate,
        current_location,
        max_capacity,
      });

      if (!updatedKurir) {
        return sendError(res, 'Kurir not found', 404);
      }

      return sendSuccess(res, 'Kurir profile updated successfully', updatedKurir);
    } catch (error: any) {
      console.error('Update kurir error:', error);
      return sendError(res, error.message || 'Failed to update kurir profile', 500, error.message);
    }
  }

  async delete(req: AuthRequest, res: Response) {
    try {
      const { id } = req.params;

      if (!id) {
        return sendError(res, 'Kurir ID is required', 400);
      }

      const result = await kurirService.deleteKurir(parseInt(id));

      if (!result) {
        return sendError(res, 'Kurir not found', 404);
      }

      return sendSuccess(res, 'Kurir deleted successfully', { id: parseInt(id) });
    } catch (error: any) {
      console.error('Delete kurir error:', error);
      return sendError(res, error.message || 'Failed to delete kurir', 500, error.message);
    }
  }

  async getAvailableUsers(req: AuthRequest, res: Response) {
    try {
      const users = await kurirService.getAvailableUsers();
      return sendSuccess(res, 'Available users retrieved successfully', { users });
    } catch (error: any) {
      console.error('Get available users error:', error);
      return sendError(res, 'Failed to get available users', 500, error.message);
    }
  }
}
