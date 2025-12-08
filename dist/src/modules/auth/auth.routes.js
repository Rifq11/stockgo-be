"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_controller_1 = require("./auth.controller");
const auth_middleware_1 = require("../../middleware/auth.middleware");
const router = (0, express_1.Router)();
const authController = new auth_controller_1.AuthController();
router.post('/login', authController.login.bind(authController));
router.post('/register', authController.register.bind(authController));
router.post('/logout', auth_middleware_1.authenticate, authController.logout.bind(authController));
router.get('/profile', auth_middleware_1.authenticate, authController.getProfile.bind(authController));
router.put('/profile', auth_middleware_1.authenticate, authController.updateProfile.bind(authController));
exports.default = router;
//# sourceMappingURL=auth.routes.js.map