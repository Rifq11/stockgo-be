"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendError = exports.sendSuccess = void 0;
const sendSuccess = (res, message, data, statusCode = 200) => {
    const response = {
        success: true,
        message,
        ...(data !== undefined && { data }),
        timestamp: new Date().toISOString(),
    };
    return res.status(statusCode).json(response);
};
exports.sendSuccess = sendSuccess;
const sendError = (res, message, statusCode = 500, error) => {
    const response = {
        success: false,
        message,
        error: error || message,
        timestamp: new Date().toISOString(),
    };
    return res.status(statusCode).json(response);
};
exports.sendError = sendError;
//# sourceMappingURL=response.util.js.map