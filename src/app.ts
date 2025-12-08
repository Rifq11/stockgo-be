import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// STATIC UPLOADS (PREFIX = /stockgo/uploads)
// __dirname = dist/src biasanya → naik 2 level ke root project
app.use(
  '/stockgo/uploads',
  express.static(path.resolve(__dirname, '../../public/uploads'))
);

// HEALTH CHECK
app.get('/stockgo/health', (req, res) => {
  res.json({
    status: 'OK',
    message: 'Kurir Barang API is running',
    timestamp: new Date().toISOString()
  });
});

// ROUTES
import authRoutes from './modules/auth/auth.routes';
import warehouseRoutes from './modules/warehouse/warehouse.routes';
import kurirRoutes from './modules/kurir/kurir.routes';
import expeditionRoutes from './modules/expedition/expedition.routes';
import customerRoutes from './modules/customer/customer.routes';
import deliveryRoutes from './modules/delivery/delivery.routes';
import dashboardRoutes from './modules/dashboard/dashboard.routes';
import mediaRoutes from './modules/media/media.routes';
import productRoutes from './modules/product/product.routes';
import reportRoutes from './modules/report/report.routes';

// PREFIX SEMUA ROUTE DENGAN /stockgo/api
app.use('/stockgo/api/auth', authRoutes);
app.use('/stockgo/api/customers', customerRoutes);
app.use('/stockgo/api/deliveries', deliveryRoutes);
app.use('/stockgo/api/dashboard', dashboardRoutes);
app.use('/stockgo/api/media', mediaRoutes);
app.use('/stockgo/api/products', productRoutes);
app.use('/stockgo/api/warehouses', warehouseRoutes);
app.use('/stockgo/api/kurir', kurirRoutes);
app.use('/stockgo/api/expeditions', expeditionRoutes);
app.use('/stockgo/api/reports', reportRoutes);

// 404 HANDLER
app.use((req, res) => {
  res.status(404).json({
    error: 'Route not found',
    path: req.originalUrl
  });
});

// ERROR HANDLER
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error(err.stack);
  res.status(500).json({
    error: 'Something went wrong!',
    message: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error'
  });
});

export default app;
