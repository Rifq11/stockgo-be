"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const path_1 = __importDefault(require("path"));
dotenv_1.default.config();
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.use('/uploads', express_1.default.static(path_1.default.resolve(__dirname, '../public/uploads')));
const auth_routes_1 = __importDefault(require("./modules/auth/auth.routes"));
const warehouse_routes_1 = __importDefault(require("./modules/warehouse/warehouse.routes"));
const kurir_routes_1 = __importDefault(require("./modules/kurir/kurir.routes"));
const expedition_routes_1 = __importDefault(require("./modules/expedition/expedition.routes"));
const customer_routes_1 = __importDefault(require("./modules/customer/customer.routes"));
const delivery_routes_1 = __importDefault(require("./modules/delivery/delivery.routes"));
const dashboard_routes_1 = __importDefault(require("./modules/dashboard/dashboard.routes"));
const media_routes_1 = __importDefault(require("./modules/media/media.routes"));
const product_routes_1 = __importDefault(require("./modules/product/product.routes"));
const report_routes_1 = __importDefault(require("./modules/report/report.routes"));
app.use('/api/auth', auth_routes_1.default);
app.use('/api/customers', customer_routes_1.default);
app.use('/api/deliveries', delivery_routes_1.default);
app.use('/api/dashboard', dashboard_routes_1.default);
app.use('/api/media', media_routes_1.default);
app.use('/api/products', product_routes_1.default);
app.use('/api/warehouses', warehouse_routes_1.default);
app.use('/api/kurir', kurir_routes_1.default);
app.use('/api/expeditions', expedition_routes_1.default);
app.use('/api/reports', report_routes_1.default);
app.use((req, res) => {
    res.status(404).json({
        error: 'Route not found',
        path: req.originalUrl
    });
});
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({
        error: 'Something went wrong!',
        message: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error'
    });
});
exports.default = app;
//# sourceMappingURL=app.js.map