import { Response } from 'express';
import { AuthRequest } from '../../middleware/auth.middleware';
import { db } from '../../config/db';
import { deliveryMedia } from '../../../drizzle/schema';
import { eq } from 'drizzle-orm';
import { sendSuccess, sendError } from '../../utils/response.util';
import fs from 'fs';
import path from 'path';

export class MediaController {
  async uploadDeliveryMedia(req: AuthRequest, res: Response) {
    try {
      const { delivery_id, media_type } = req.body;
      const files = req.files as Express.Multer.File[];

      if (!delivery_id || !files || files.length === 0) {
        return sendError(res, 'Delivery ID and files are required', 400);
      }

      const uploadedFiles: any[] = [];

      for (const file of files) {
        await db
          .insert(deliveryMedia)
          .values({
            delivery_id: parseInt(delivery_id),
            media_type: media_type || 'image',
            file_url: file.path,
            file_name: file.originalname,
            file_size: file.size,
            uploaded_by: req.user!.id,
          });

        const [created] = await db
          .select()
          .from(deliveryMedia)
          .where(eq(deliveryMedia.file_url, file.path))
          .limit(1);

        if (created) uploadedFiles.push(created);
      }

      return sendSuccess(res, 'Files uploaded successfully', uploadedFiles, 201);
    } catch (error: any) {
      console.error('Upload media error:', error);
      return sendError(res, 'Failed to upload media', 500, error.message);
    }
  }

  async getDeliveryMedia(req: AuthRequest, res: Response) {
    try {
      const { delivery_id } = req.params;
      if (!delivery_id) {
        return sendError(res, 'Delivery ID is required', 400);
      }

      const mediaFiles = await db
        .select()
        .from(deliveryMedia)
        .where(eq(deliveryMedia.delivery_id, parseInt(delivery_id)));

      return sendSuccess(res, 'Media files retrieved successfully', mediaFiles);
    } catch (error: any) {
      console.error('Get delivery media error:', error);
      return sendError(res, 'Failed to get media files', 500, error.message);
    }
  }

  async deleteMedia(req: AuthRequest, res: Response) {
    try {
      const { id } = req.params;
      if (!id) {
        return sendError(res, 'Media ID is required', 400);
      }

      const [mediaFile] = await db
        .select()
        .from(deliveryMedia)
        .where(eq(deliveryMedia.id, parseInt(id)))
        .limit(1);

      if (!mediaFile) {
        return sendError(res, 'Media file not found', 404);
      }

      if (fs.existsSync(mediaFile.file_url)) {
        fs.unlinkSync(mediaFile.file_url);
      }

      await db
        .delete(deliveryMedia)
        .where(eq(deliveryMedia.id, parseInt(id)));

      return sendSuccess(res, 'Media file deleted successfully');
    } catch (error: any) {
      console.error('Delete media error:', error);
      return sendError(res, 'Failed to delete media file', 500, error.message);
    }
  }

  async serveMedia(req: AuthRequest, res: Response) {
    try {
      const { filename } = req.params;
      const { type } = req.query;
      if (!filename) {
        return sendError(res, 'Filename is required', 400);
      }
      const folder = (type as string) || 'delivery';
      // Use __dirname to ensure correct path in production (cPanel)
      // __dirname in compiled JS will be dist/src/modules/media, so we go up 4 levels to reach root
      const baseUploadDir = process.env.UPLOAD_DIR 
        ? process.env.UPLOAD_DIR 
        : path.resolve(__dirname, '../../../../public/uploads');
      const filePath = path.join(baseUploadDir, folder, filename);

      if (!fs.existsSync(filePath)) {
        return sendError(res, 'File not found', 404);
      }

      return sendSuccess(res, 'Media file served successfully', filePath);
    } catch (error: any) {
      console.error('Serve media error:', error);
      return sendError(res, 'Failed to serve media file', 500, error.message);
    }
  }
}

