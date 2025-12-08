import { Response } from 'express';
import path from 'path';
import fs from 'fs';
import { AuthRequest } from '../../middleware/auth.middleware';
import { db } from '../../config/db';
import { uploadFile } from '../../../drizzle/schema';
import { eq } from 'drizzle-orm';
import { sendError, sendSuccess } from '../../utils/response.util';

export class UploadController {
  async upload(req: AuthRequest, res: Response) {
    try {
      const file = req.file;
      if (!file) {
        return sendError(res, 'File is required', 400);
      }

      const fileUrl = file.path.replace(/^public[\\/]/, '').replace(/\\/g, '/');

      const insertedId = await db
        .insert(uploadFile)
        .values({
          file_name: file.originalname,
          file_url: `/${fileUrl}`,
          mime_type: file.mimetype,
          file_size: file.size,
          uploaded_by: req.user?.id ?? null,
        })
        .$returningId();

      const inserted = insertedId[0];
      if (!inserted) {
        return sendError(res, 'Failed to store file metadata', 500);
      }

      const [created] = await db
        .select()
        .from(uploadFile)
        .where(eq(uploadFile.id, inserted.id));

      return sendSuccess(res, 'File uploaded successfully', created, 201);
    } catch (error: any) {
      console.error('Upload error:', error);
      return sendError(res, 'Failed to upload file', 500, error.message);
    }
  }

  async list(req: AuthRequest, res: Response) {
    try {
      const files = await db.select().from(uploadFile);
      return sendSuccess(res, 'Files retrieved successfully', files);
    } catch (error: any) {
      console.error('List uploads error:', error);
      return sendError(res, 'Failed to retrieve files', 500, error.message);
    }
  }

  async getById(req: AuthRequest, res: Response) {
    try {
      const { id } = req.params;
      if (!id) {
        return sendError(res, 'File ID is required', 400);
      }
      const [fileRow] = await db.select().from(uploadFile).where(eq(uploadFile.id, parseInt(id)));

      if (!fileRow) {
        return sendError(res, 'File not found', 404);
      }

      return sendSuccess(res, 'File retrieved successfully', fileRow);
    } catch (error: any) {
      console.error('Get upload error:', error);
      return sendError(res, 'Failed to retrieve file', 500, error.message);
    }
  }

  async delete(req: AuthRequest, res: Response) {
    try {
      const { id } = req.params;
      if (!id) {
        return sendError(res, 'File ID is required', 400);
      }
      const [fileRow] = await db.select().from(uploadFile).where(eq(uploadFile.id, parseInt(id)));

      if (!fileRow) {
        return sendError(res, 'File not found', 404);
      }

      const absolutePath = path.join(process.cwd(), 'public', fileRow.file_url.replace(/^\//, ''));
      if (fs.existsSync(absolutePath)) {
        fs.unlinkSync(absolutePath);
      }

      await db.delete(uploadFile).where(eq(uploadFile.id, parseInt(id)));

      return sendSuccess(res, 'File deleted successfully');
    } catch (error: any) {
      console.error('Delete upload error:', error);
      return sendError(res, 'Failed to delete file', 500, error.message);
    }
  }
}

