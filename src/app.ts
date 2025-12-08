import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// Use __dirname to ensure correct path in production (cPanel)
// __dirname in compiled JS will be dist/src, so we go up 2 levels to reach root
app.use('/uploads', express.static(path.resolve(__dirname, '../../public/uploads')));

app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'Kurir Barang API is running',
    timestamp: new Date().toISOString()
  });
});

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

app.use('/api/auth', authRoutes);
app.use('/api/customers', customerRoutes);
app.use('/api/deliveries', deliveryRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/media', mediaRoutes);
app.use('/api/products', productRoutes);
app.use('/api/warehouses', warehouseRoutes);
app.use('/api/kurir', kurirRoutes);
app.use('/api/expeditions', expeditionRoutes);
app.use('/api/reports', reportRoutes);

app.use((req, res) => {
  res.status(404).json({ 
    error: 'Route not found',
    path: req.originalUrl 
  });
});

app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ 
    error: 'Something went wrong!',
    message: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error'
  });
});

export default app;
