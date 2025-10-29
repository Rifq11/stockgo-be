import { Router } from 'express';
import { MediaController } from './media.controller';
import { authenticate, authorize } from '../../middleware/auth.middleware';
import { uploadDeliveryMedia } from '../../middleware/upload.middleware';

const router = Router();
const mediaController = new MediaController();

router.post('/upload', authenticate, uploadDeliveryMedia, mediaController.uploadDeliveryMedia.bind(mediaController));
router.get('/delivery/:delivery_id', authenticate, mediaController.getDeliveryMedia.bind(mediaController));
router.delete('/:id', authenticate, authorize('admin'), mediaController.deleteMedia.bind(mediaController));
router.get('/serve/:type/:filename', mediaController.serveMedia.bind(mediaController));

export default router;

