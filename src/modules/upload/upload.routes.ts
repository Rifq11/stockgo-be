import { Router } from 'express';
import { UploadController } from './upload.controller';
import { authenticate, authorize } from '../../middleware/auth.middleware';
import { uploadSingle } from '../../middleware/upload.middleware';

const router = Router();
const controller = new UploadController();

// Create/upload file
router.post('/', authenticate, uploadSingle, controller.upload.bind(controller));

// Read/list files
router.get('/', authenticate, controller.list.bind(controller));
router.get('/:id', authenticate, controller.getById.bind(controller));

// Delete file
router.delete('/:id', authenticate, authorize('admin'), controller.delete.bind(controller));

export default router;

