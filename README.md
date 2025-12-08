# StockGo-Be

Backend API for Warehouse and Delivery Management System built with Express, TypeScript, and Drizzle ORM (MySQL) for SMKN 24 Jakarta - Kelompok 09.

## Features

- Warehouse Management (Data Gudang)
- Kurir Management (Data Kurir)
- Expedition Reports (Laporan Ekspedisi)
- Product & Inventory Management
- Delivery Tracking
- Real-time Status Updates
- Express.js server
- TypeScript support
- Drizzle ORM (MySQL)
- Environment variable support with dotenv

## Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/Rifq11/stockgo-be.git
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables

Buat file `.env` di root project dan tambahkan:

```env
DATABASE_URL="mysql://USER:PASSWORD@HOST:PORT/DATABASE"
PORT=3000
# Folder upload untuk media (default ke public/uploads agar bisa diserve statis)
UPLOAD_DIR="public/uploads"
```

Ganti `USER`, `PASSWORD`, `HOST`, `PORT`, dan `DATABASE` sesuai konfigurasi MySQL Anda.

### 4. Setup database & Drizzle

- Buat database kosong di MySQL
- Jalankan migrasi schema dengan Drizzle:
  ```bash
  npm run drizzle:push
  ```

### 5. Seed Database (Optional)

Untuk isi data dummy:
```bash
npm run seed
```

Ini akan membuat:
- 5 user (admin, dispatcher, 2 kurir, petugas gudang)
- 2 warehouse
- 4 categories
- 4 products
- 3 customers

**Login credentials:**
- Admin: `admin@kurirbarang.com` / `password`
- Dispatcher: `dispatcher@kurirbarang.com` / `password`
- Kurir 1: `kurir1@kurirbarang.com` / `password`
- Kurir 2: `kurir2@kurirbarang.com` / `password`
- Petugas Gudang: `gudang@kurirbarang.com` / `password`

Peran & penggunaan:
- Admin (web): akses penuh dashboard/admin.
- Dispatcher (web): kelola pengiriman/ekspedisi.
- Petugas Gudang (web): kelola stok/warehouse.
- Kurir (mobile): akses daftar pengiriman & tracking di aplikasi Android.

### 6. Jalankan aplikasi

#### Development (dengan hot reload):

```bash
npm run dev
```

#### Production (build & start):

```bash
npm run build
npm start
```

Aplikasi akan berjalan di `http://localhost:3000` (atau port sesuai `.env`).

---

## API Endpoint

### 🔐 Authentication

- `POST /api/auth/login` — Login user (Mobile & Admin)
- `POST /api/auth/register` — Register user (Admin only)
- `POST /api/auth/logout` — Logout (Authenticated)
- `GET /api/auth/profile` — Get user profile (Authenticated)

### 👥 Customer Management (Admin)

- `POST /api/customers` — Create customer
- `GET /api/customers` — List customers
- `GET /api/customers/:id` — Get customer by ID
- `PUT /api/customers/:id` — Update customer
- `DELETE /api/customers/:id` — Delete customer

### 📦 Delivery Management

**Mobile App Endpoints:**
- `GET /api/deliveries/track/:tracking_number` — Track delivery (Public)
- `GET /api/deliveries` — Get deliveries
- `GET /api/deliveries/:id` — Get delivery details

**Admin Endpoints:**
- `POST /api/deliveries` — Create delivery
- `PUT /api/deliveries/:id/status` — Update delivery status
- `PUT /api/deliveries/:id/assign` — Assign kurir

### 🏢 Warehouse Management

- `GET /api/warehouses` — List warehouses
- `GET /api/warehouses/:id` — Get warehouse by ID
- `POST /api/warehouses` — Create warehouse
- `PUT /api/warehouses/:id` — Update warehouse
- `DELETE /api/warehouses/:id` — Delete warehouse

### 🚚 Kurir Management

- `GET /api/kurir` — List kurir
- `GET /api/kurir/:id` — Get kurir by ID
- `PUT /api/kurir/:id/status` — Update kurir status
- `GET /api/kurir/:id/performance` — Get kurir performance

### 🚛 Expeditions Management

- `GET /api/expeditions` — List expeditions
- `GET /api/expeditions/:id` — Get expedition by ID
- `POST /api/expeditions` — Create expedition
- `PUT /api/expeditions/:id/status` — Update expedition status
- `GET /api/expeditions/reports/summary` — Get expedition reports

### 📊 Dashboard & Analytics (Admin)

- `GET /api/dashboard/stats` — Get dashboard statistics
- `GET /api/dashboard/analytics` — Get delivery analytics
- `GET /api/dashboard/kurir-performance` — Get kurir performance
- `GET /api/dashboard/warehouse-stats` — Get warehouse statistics

### 📁 Media Management

- `POST /api/media/upload` — Upload delivery media files
- `GET /api/media/delivery/:delivery_id` — Get delivery media
- `DELETE /api/media/:id` — Delete media file
- `GET /api/media/serve/:type/:filename` — Serve media file


---

## Struktur Direktori

```
.env
drizzle.config.ts
package.json
README.md
tsconfig.json
src/
  app.ts          # Express app setup
  server.ts       # Entry point
  config/
    db.ts
    drizzle.ts
  modules/
    auth/
    warehouse/
    kurir/
    expedition/
    products/
    deliveries/
  utils/
drizzle/
  schema.ts
  migrations/
```

## Database Schema

### Tabel Utama:

#### 👥 **User Management**
- `user` - Data pengguna (admin, dispatcher, kurir, petugas gudang)
- `role` - Role pengguna
- `kurir` - Data kurir dengan kendaraan dan performa

#### 🏢 **Warehouse Management**
- `warehouse` - Data gudang pusat dan cabang
- `inventory` - Stok produk per gudang
- `stock_movement` - Riwayat pergerakan stok

#### 📦 **Product Management**
- `product` - Data produk distributor
- `category` - Kategori produk
- `product_image` - Gambar produk

#### 🚚 **Delivery & Expedition**
- `delivery` - Data pengiriman individual
- `expedition` - Data ekspedisi (kumpulan pengiriman)
- `expedition_item` - Item dalam ekspedisi
- `customer` - Data pelanggan
- `delivery_item` - Item dalam pengiriman
- `delivery_status_history` - Riwayat status pengiriman

#### 📊 **Reports & Analytics**
- `delivery_report` - Laporan pengiriman
- `expedition_report` - Laporan ekspedisi
- `kurir_performance` - Performa kurir

### Enums:
- `user_role`: admin, dispatcher, kurir, petugas_gudang
- `delivery_status`: pending, picked_up, in_transit, delivered, failed, cancelled
- `expedition_status`: pending, processing, shipped, delivered, returned
- `kurir_status`: available, busy, offline, on_break
- `product_status`: available, out_of_stock, discontinued
- `warehouse_type`: main, branch, distribution_center

## Role Pengguna

### 🎯 **Fokus Distributor**
Sistem ini dirancang khusus untuk **distributor** yang membutuhkan:

1. **Admin** - Full access ke semua fitur sistem
2. **Dispatcher** - Mengelola ekspedisi dan kurir
3. **Kurir** - Update status pengiriman dan upload media
4. **Petugas Gudang** - Kelola inventori dan stok

### 🏢 **Fitur Utama untuk Distributor**
- **Manajemen Multi-Gudang**: Kelola gudang pusat dan cabang
- **Tracking Kurir Real-time**: Monitor lokasi dan status kurir
- **Laporan Ekspedisi**: Analisis performa pengiriman
- **Manajemen Stok**: Kontrol inventori per gudang
- **Analisis Performa**: Laporan kurir dan efisiensi pengiriman

## 🎯 **Tiga Fitur Utama Sesuai LKPD**

### 1. 📊 **Data Gudang**
- Manajemen gudang pusat dan cabang
- Tracking kapasitas dan lokasi gudang
- Manajemen stok per gudang
- Laporan inventori real-time

### 2. 🚚 **Kurir**
- Data kurir dengan kendaraan dan kapasitas
- Status kurir real-time (available, busy, offline)
- Tracking lokasi kurir
- Performance monitoring dan rating kurir

### 3. 📦 **Laporan Ekspedisi**
- Laporan pengiriman harian/mingguan
- Tracking status ekspedisi
- Analisis performa kurir
- Laporan keuangan ekspedisi

## Development Guidelines

- Gunakan TypeScript untuk type safety
- Follow REST API conventions
- Implement proper error handling
- Use middleware untuk authentication dan validation
- Write comprehensive tests
- Document API endpoints

## Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run seed` - Seed database with dummy data
- `npm run drizzle:gen` - Generate migrations
- `npm run drizzle:push` - Push schema to database
- `npm run drizzle:studio` - Open Drizzle Studio

## Contributing

1. Fork repository
2. Create feature branch
3. Commit changes
4. Push to branch
5. Create Pull Request

## License

ISC License - SMKN 24 Jakarta Kelompok 09