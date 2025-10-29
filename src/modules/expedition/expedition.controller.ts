import { Response } from 'express';
import { AuthRequest } from '../../middleware/auth.middleware';
import { sendSuccess, sendError } from '../../utils/response.util';
import { ExpeditionService } from './expedition.service';

const expeditionService = new ExpeditionService();

export class ExpeditionController {
  async getAll(req: AuthRequest, res: Response) {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;

      const expeditions = await expeditionService.getExpeditions(page, limit);

      return sendSuccess(res, 'Expeditions retrieved successfully', {
        expeditions,
        pagination: {
          page,
          limit,
        },
      });
    } catch (error: any) {
      console.error('Get expeditions error:', error);
      return sendError(res, 'Failed to fetch expeditions', 500, error.message);
    }
  }

  async getById(req: AuthRequest, res: Response) {
    try {
      const { id } = req.params;

      if (!id) {
        return sendError(res, 'Expedition ID is required', 400);
      }

      const expedition = await expeditionService.getExpeditionById(parseInt(id));

      if (!expedition) {
        return sendError(res, 'Expedition not found', 404);
      }

      return sendSuccess(res, 'Expedition retrieved successfully', expedition);
    } catch (error: any) {
      console.error('Get expedition error:', error);
      return sendError(res, 'Failed to fetch expedition', 500, error.message);
    }
  }

  async create(req: AuthRequest, res: Response) {
    try {
      const { warehouse_id, kurir_id, notes, delivery_ids } = req.body;

      if (!warehouse_id || !delivery_ids || !Array.isArray(delivery_ids)) {
        return sendError(res, 'Warehouse ID and delivery IDs are required', 400);
      }

      const expedition = await expeditionService.createExpedition({
        warehouse_id,
        kurir_id,
        notes,
        delivery_ids,
        created_by: req.user!.id,
      });

      return sendSuccess(res, 'Expedition created successfully', expedition, 201);
    } catch (error: any) {
      console.error('Create expedition error:', error);
      return sendError(res, 'Failed to create expedition', 500, error.message);
    }
  }

  async updateStatus(req: AuthRequest, res: Response) {
    try {
      const { id } = req.params;
      const { status, notes } = req.body;

      if (!id || !status) {
        return sendError(res, 'Expedition ID and status are required', 400);
      }

      const expedition = await expeditionService.updateExpeditionStatus(parseInt(id), status, notes);

      return sendSuccess(res, 'Expedition status updated successfully', expedition);
    } catch (error: any) {
      console.error('Update expedition status error:', error);
      return sendError(res, 'Failed to update expedition status', 500, error.message);
    }
  }

  async getReport(req: AuthRequest, res: Response) {
    try {
      const { warehouse_id, date_from, date_to } = req.query;

      const report = await expeditionService.getExpeditionReport(
        warehouse_id ? parseInt(warehouse_id as string) : undefined,
        date_from as string,
        date_to as string
      );

      return sendSuccess(res, 'Expedition report retrieved successfully', report);
    } catch (error: any) {
      console.error('Get expedition report error:', error);
      return sendError(res, 'Failed to fetch expedition report', 500, error.message);
    }
  }
}
