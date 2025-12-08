"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const media_controller_1 = require("./media.controller");
const auth_middleware_1 = require("../../middleware/auth.middleware");
const upload_middleware_1 = require("../../middleware/upload.middleware");
const router = (0, express_1.Router)();
const mediaController = new media_controller_1.MediaController();
router.post('/upload', auth_middleware_1.authenticate, upload_middleware_1.uploadDeliveryMedia, mediaController.uploadDeliveryMedia.bind(mediaController));
router.get('/delivery/:delivery_id', auth_middleware_1.authenticate, mediaController.getDeliveryMedia.bind(mediaController));
router.delete('/:id', auth_middleware_1.authenticate, (0, auth_middleware_1.authorize)('admin'), mediaController.deleteMedia.bind(mediaController));
router.get('/serve/:type/:filename', mediaController.serveMedia.bind(mediaController));
exports.default = router;
//# sourceMappingURL=media.routes.js.map