import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

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

app.use('/api/auth', authRoutes);
app.use('/api/warehouses', warehouseRoutes);
app.use('/api/kurir', kurirRoutes);
app.use('/api/expeditions', expeditionRoutes);

app.use('*', (req, res) => {
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
