"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const upload_controller_1 = require("./upload.controller");
const auth_middleware_1 = require("../../middleware/auth.middleware");
const upload_middleware_1 = require("../../middleware/upload.middleware");
const router = (0, express_1.Router)();
const controller = new upload_controller_1.UploadController();
router.post('/', auth_middleware_1.authenticate, upload_middleware_1.uploadSingle, controller.upload.bind(controller));
router.get('/', auth_middleware_1.authenticate, controller.list.bind(controller));
router.get('/:id', auth_middleware_1.authenticate, controller.getById.bind(controller));
router.delete('/:id', auth_middleware_1.authenticate, (0, auth_middleware_1.authorize)('admin'), controller.delete.bind(controller));
exports.default = router;
//# sourceMappingURL=upload.routes.js.map