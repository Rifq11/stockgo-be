"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MediaController = void 0;
const db_1 = require("../../config/db");
const schema_1 = require("../../../drizzle/schema");
const drizzle_orm_1 = require("drizzle-orm");
const response_util_1 = require("../../utils/response.util");
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
class MediaController {
    async uploadDeliveryMedia(req, res) {
        try {
            const { delivery_id, media_type } = req.body;
            const files = req.files;
            if (!delivery_id || !files || files.length === 0) {
                return (0, response_util_1.sendError)(res, 'Delivery ID and files are required', 400);
            }
            const uploadedFiles = [];
            for (const file of files) {
                await db_1.db
                    .insert(schema_1.deliveryMedia)
                    .values({
                    delivery_id: parseInt(delivery_id),
                    media_type: media_type || 'image',
                    file_url: file.path,
                    file_name: file.originalname,
                    file_size: file.size,
                    uploaded_by: req.user.id,
                });
                const [created] = await db_1.db
                    .select()
                    .from(schema_1.deliveryMedia)
                    .where((0, drizzle_orm_1.eq)(schema_1.deliveryMedia.file_url, file.path))
                    .limit(1);
                if (created)
                    uploadedFiles.push(created);
            }
            return (0, response_util_1.sendSuccess)(res, 'Files uploaded successfully', uploadedFiles, 201);
        }
        catch (error) {
            console.error('Upload media error:', error);
            return (0, response_util_1.sendError)(res, 'Failed to upload media', 500, error.message);
        }
    }
    async getDeliveryMedia(req, res) {
        try {
            const { delivery_id } = req.params;
            if (!delivery_id) {
                return (0, response_util_1.sendError)(res, 'Delivery ID is required', 400);
            }
            const mediaFiles = await db_1.db
                .select()
                .from(schema_1.deliveryMedia)
                .where((0, drizzle_orm_1.eq)(schema_1.deliveryMedia.delivery_id, parseInt(delivery_id)));
            return (0, response_util_1.sendSuccess)(res, 'Media files retrieved successfully', mediaFiles);
        }
        catch (error) {
            console.error('Get delivery media error:', error);
            return (0, response_util_1.sendError)(res, 'Failed to get media files', 500, error.message);
        }
    }
    async deleteMedia(req, res) {
        try {
            const { id } = req.params;
            if (!id) {
                return (0, response_util_1.sendError)(res, 'Media ID is required', 400);
            }
            const [mediaFile] = await db_1.db
                .select()
                .from(schema_1.deliveryMedia)
                .where((0, drizzle_orm_1.eq)(schema_1.deliveryMedia.id, parseInt(id)))
                .limit(1);
            if (!mediaFile) {
                return (0, response_util_1.sendError)(res, 'Media file not found', 404);
            }
            if (fs_1.default.existsSync(mediaFile.file_url)) {
                fs_1.default.unlinkSync(mediaFile.file_url);
            }
            await db_1.db
                .delete(schema_1.deliveryMedia)
                .where((0, drizzle_orm_1.eq)(schema_1.deliveryMedia.id, parseInt(id)));
            return (0, response_util_1.sendSuccess)(res, 'Media file deleted successfully');
        }
        catch (error) {
            console.error('Delete media error:', error);
            return (0, response_util_1.sendError)(res, 'Failed to delete media file', 500, error.message);
        }
    }
    async serveMedia(req, res) {
        try {
            const { filename } = req.params;
            const { type } = req.query;
            if (!filename) {
                return (0, response_util_1.sendError)(res, 'Filename is required', 400);
            }
            const folder = type || 'delivery';
            const baseUploadDir = process.env.UPLOAD_DIR
                ? process.env.UPLOAD_DIR
                : path_1.default.resolve(__dirname, '../../public/uploads');
            const filePath = path_1.default.join(baseUploadDir, folder, filename);
            if (!fs_1.default.existsSync(filePath)) {
                return (0, response_util_1.sendError)(res, 'File not found', 404);
            }
            return (0, response_util_1.sendSuccess)(res, 'Media file served successfully', filePath);
        }
        catch (error) {
            console.error('Serve media error:', error);
            return (0, response_util_1.sendError)(res, 'Failed to serve media file', 500, error.message);
        }
    }
}
exports.MediaController = MediaController;
//# sourceMappingURL=media.controller.js.map