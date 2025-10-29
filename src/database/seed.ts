import 'dotenv/config';
import { db } from '../config/db';
import bcrypt from 'bcryptjs';
import {
  role,
  user,
  warehouse,
  kurir,
  customer,
  product,
  category,
  productImage,
} from '../../drizzle/schema';

async function seed() {
  console.log('🌱 Starting database seed...\n');

  try {
    // 1. Seed Roles
    console.log('📋 Creating roles...');
    await db.insert(role).values([
      { name: 'admin', description: 'Administrator with full access' },
      { name: 'dispatcher', description: 'Dispatcher who manages expeditions' },
      { name: 'kurir', description: 'Delivery person' },
      { name: 'petugas_gudang', description: 'Warehouse staff' },
    ]);
    console.log('✅ Roles created\n');

    // 2. Seed Users
    console.log('👥 Creating users...');
    const hashedPassword = await bcrypt.hash('password', 10);

    await db.insert(user).values([
      {
        full_name: 'Admin User',
        email: 'admin@kurirbarang.com',
        password: hashedPassword,
        phone: '081234567890',
        role_id: 1, // admin
        is_active: true,
      },
      {
        full_name: 'Dispatcher User',
        email: 'dispatcher@kurirbarang.com',
        password: hashedPassword,
        phone: '081234567891',
        role_id: 2, // dispatcher
        is_active: true,
      },
      {
        full_name: 'Kurir 1',
        email: 'kurir1@kurirbarang.com',
        password: hashedPassword,
        phone: '081234567892',
        role_id: 3, // kurir
        is_active: true,
      },
      {
        full_name: 'Kurir 2',
        email: 'kurir2@kurirbarang.com',
        password: hashedPassword,
        phone: '081234567893',
        role_id: 3, // kurir
        is_active: true,
      },
      {
        full_name: 'Petugas Gudang',
        email: 'gudang@kurirbarang.com',
        password: hashedPassword,
        phone: '081234567894',
        role_id: 4, // petugas_gudang
        is_active: true,
      },
    ]);
    console.log('✅ Users created\n');

    // 3. Seed Warehouses
    console.log('🏢 Creating warehouses...');
    await db.insert(warehouse).values([
      {
        name: 'Gudang Pusat Jakarta',
        code: 'GDG-JKT-001',
        type: 'main' as any,
        address: 'Jl. Raya Jakarta No.123',
        city: 'Jakarta',
        province: 'DKI Jakarta',
        postal_code: '12345',
        phone: '021-12345678',
        email: 'gudang.jkt@kurirbarang.com',
        manager_id: 1,
        is_active: true,
      },
      {
        name: 'Gudang Cabang Bandung',
        code: 'GDG-BDG-001',
        type: 'branch' as any,
        address: 'Jl. Raya Bandung No.456',
        city: 'Bandung',
        province: 'Jawa Barat',
        postal_code: '40511',
        phone: '022-87654321',
        email: 'gudang.bdg@kurirbarang.com',
        is_active: true,
      },
    ]);
    console.log('✅ Warehouses created\n');

    // 4. Seed Kurir
    console.log('🚚 Creating kurirs...');
    await db.insert(kurir).values({
      user_id: 3,
      employee_id: 'KUR-001',
      license_number: 'SIM-001',
      vehicle_type: 'Motor',
      vehicle_plate: 'B1234ABC',
      status: 'available' as any,
      current_location: '-6.2088,106.8456',
      rating: '4.5',
      total_deliveries: 0,
    });
    
    await db.insert(kurir).values({
      user_id: 4,
      employee_id: 'KUR-002',
      license_number: 'SIM-002',
      vehicle_type: 'Mobil',
      vehicle_plate: 'B5678DEF',
      status: 'available' as any,
      current_location: '-6.9175,107.6191',
      rating: '4.8',
      total_deliveries: 0,
    });
    
    console.log('✅ Kurirs created\n');

    // 5. Seed Categories
    console.log('📦 Creating product categories...');
    await db.insert(category).values([
      { name: 'Elektronik', description: 'Produk elektronik' },
      { name: 'Pakaian', description: 'Pakaian dan fashion' },
      { name: 'Makanan', description: 'Produk makanan dan minuman' },
      { name: 'Mainan', description: 'Mainan anak-anak' },
    ]);
    console.log('✅ Categories created\n');

    // 6. Seed Products
    console.log('🛍️ Creating products...');
    await db.insert(product).values([
      {
        name: 'Laptop ASUS',
        sku: 'PROD-001',
        barcode: '1234567890123',
        description: 'Laptop ASUS untuk gaming',
        category_id: 1,
        unit: 'pcs',
        weight: 2.5.toString(),
        dimensions: '35x25x5',
        status: 'available' as any,
      },
      {
        name: 'Kaos Kaki',
        sku: 'PROD-002',
        description: 'Kaos kaki premium',
        category_id: 2,
        unit: 'pasang',
        weight: 0.1.toString(),
        dimensions: '20x15x5',
        status: 'available' as any,
      },
      {
        name: 'Susu UHT',
        sku: 'PROD-003',
        description: 'Susu UHT 1 liter',
        category_id: 3,
        unit: 'botol',
        weight: 1.2.toString(),
        dimensions: '10x10x25',
        status: 'available' as any,
      },
      {
        name: 'Mainan Robot',
        sku: 'PROD-004',
        description: 'Robot remote control',
        category_id: 4,
        unit: 'pcs',
        weight: 0.8.toString(),
        dimensions: '30x20x15',
        status: 'available' as any,
      },
    ]);
    console.log('✅ Products created\n');

    // 7. Seed Customers
    console.log('👤 Creating customers...');
    await db.insert(customer).values([
      {
        name: 'PT Toko Serba Ada',
        email: 'toko@example.com',
        phone: '081234567895',
        address: 'Jl. Sudirman No.45',
        city: 'Jakarta',
        province: 'DKI Jakarta',
        postal_code: '12190',
        is_active: true,
      },
      {
        name: 'CV Jaya Abadi',
        email: 'jaya@example.com',
        phone: '081234567896',
        address: 'Jl. Gatot Subroto No.10',
        city: 'Jakarta',
        province: 'DKI Jakarta',
        postal_code: '12930',
        is_active: true,
      },
      {
        name: 'Toko Makmur Sejahtera',
        email: 'makmur@example.com',
        phone: '081234567897',
        address: 'Jl. Ahmad Yani No.88',
        city: 'Bandung',
        province: 'Jawa Barat',
        postal_code: '40124',
        is_active: true,
      },
    ]);
    console.log('✅ Customers created\n');

    console.log('🎉 Database seeded successfully!\n');

    // Display login credentials
    console.log('📝 Default Login Credentials:');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('👨‍💼 Admin:');
    console.log('   Email: admin@kurirbarang.com');
    console.log('   Password: password');
    console.log('\n📋 Dispatcher:');
    console.log('   Email: dispatcher@kurirbarang.com');
    console.log('   Password: password');
    console.log('\n🚚 Kurir 1:');
    console.log('   Email: kurir1@kurirbarang.com');
    console.log('   Password: password');
    console.log('\n🚚 Kurir 2:');
    console.log('   Email: kurir2@kurirbarang.com');
    console.log('   Password: password');
    console.log('\n🏢 Petugas Gudang:');
    console.log('   Email: gudang@kurirbarang.com');
    console.log('   Password: password');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
}

seed();

