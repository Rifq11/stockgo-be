"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UploadController = void 0;
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const db_1 = require("../../config/db");
const schema_1 = require("../../../drizzle/schema");
const drizzle_orm_1 = require("drizzle-orm");
const response_util_1 = require("../../utils/response.util");
class UploadController {
    async upload(req, res) {
        try {
            const file = req.file;
            if (!file) {
                return (0, response_util_1.sendError)(res, 'File is required', 400);
            }
            const fileUrl = file.path.replace(/^public[\\/]/, '').replace(/\\/g, '/');
            const insertedId = await db_1.db
                .insert(schema_1.uploadFile)
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
                return (0, response_util_1.sendError)(res, 'Failed to store file metadata', 500);
            }
            const [created] = await db_1.db
                .select()
                .from(schema_1.uploadFile)
                .where((0, drizzle_orm_1.eq)(schema_1.uploadFile.id, inserted.id));
            return (0, response_util_1.sendSuccess)(res, 'File uploaded successfully', created, 201);
        }
        catch (error) {
            console.error('Upload error:', error);
            return (0, response_util_1.sendError)(res, 'Failed to upload file', 500, error.message);
        }
    }
    async list(req, res) {
        try {
            const files = await db_1.db.select().from(schema_1.uploadFile);
            return (0, response_util_1.sendSuccess)(res, 'Files retrieved successfully', files);
        }
        catch (error) {
            console.error('List uploads error:', error);
            return (0, response_util_1.sendError)(res, 'Failed to retrieve files', 500, error.message);
        }
    }
    async getById(req, res) {
        try {
            const { id } = req.params;
            if (!id) {
                return (0, response_util_1.sendError)(res, 'File ID is required', 400);
            }
            const [fileRow] = await db_1.db.select().from(schema_1.uploadFile).where((0, drizzle_orm_1.eq)(schema_1.uploadFile.id, parseInt(id)));
            if (!fileRow) {
                return (0, response_util_1.sendError)(res, 'File not found', 404);
            }
            return (0, response_util_1.sendSuccess)(res, 'File retrieved successfully', fileRow);
        }
        catch (error) {
            console.error('Get upload error:', error);
            return (0, response_util_1.sendError)(res, 'Failed to retrieve file', 500, error.message);
        }
    }
    async delete(req, res) {
        try {
            const { id } = req.params;
            if (!id) {
                return (0, response_util_1.sendError)(res, 'File ID is required', 400);
            }
            const [fileRow] = await db_1.db.select().from(schema_1.uploadFile).where((0, drizzle_orm_1.eq)(schema_1.uploadFile.id, parseInt(id)));
            if (!fileRow) {
                return (0, response_util_1.sendError)(res, 'File not found', 404);
            }
            const absolutePath = path_1.default.join(process.cwd(), 'public', fileRow.file_url.replace(/^\//, ''));
            if (fs_1.default.existsSync(absolutePath)) {
                fs_1.default.unlinkSync(absolutePath);
            }
            await db_1.db.delete(schema_1.uploadFile).where((0, drizzle_orm_1.eq)(schema_1.uploadFile.id, parseInt(id)));
            return (0, response_util_1.sendSuccess)(res, 'File deleted successfully');
        }
        catch (error) {
            console.error('Delete upload error:', error);
            return (0, response_util_1.sendError)(res, 'Failed to delete file', 500, error.message);
        }
    }
}
exports.UploadController = UploadController;
//# sourceMappingURL=upload.controller.js.map