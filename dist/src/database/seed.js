"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const db_1 = require("../config/db");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const schema_1 = require("../../drizzle/schema");
const drizzle_orm_1 = require("drizzle-orm");
async function seed() {
    console.log('🌱 Starting database seed...\n');
    try {
        console.log('🧹 Clearing tables...');
        await db_1.db.delete(schema_1.deliveryStatusHistory);
        await db_1.db.delete(schema_1.deliveryItem);
        await db_1.db.delete(schema_1.delivery);
        await db_1.db.delete(schema_1.stockMovement);
        await db_1.db.delete(schema_1.inventory);
        await db_1.db.delete(schema_1.customer);
        await db_1.db.delete(schema_1.kurir);
        await db_1.db.delete(schema_1.warehouse);
        await db_1.db.delete(schema_1.product);
        await db_1.db.delete(schema_1.category);
        await db_1.db.delete(schema_1.user);
        await db_1.db.delete(schema_1.role);
        console.log('✅ Tables cleared\n');
        console.log('📋 Creating roles...');
        await db_1.db.insert(schema_1.role).values([
            { name: 'admin', description: 'Administrator with full access' },
            { name: 'dispatcher', description: 'Dispatcher who manages expeditions' },
            { name: 'kurir', description: 'Delivery person' },
            { name: 'petugas_gudang', description: 'Warehouse staff' },
        ]);
        const roles = await db_1.db.select().from(schema_1.role);
        const roleMap = Object.fromEntries(roles.map((r) => [r.name, r.id]));
        console.log('✅ Roles created\n');
        console.log('👥 Creating users...');
        const hashedPassword = await bcryptjs_1.default.hash('password', 10);
        await db_1.db.insert(schema_1.user).values([
            {
                full_name: 'Admin User',
                email: 'admin@kurirbarang.com',
                password: hashedPassword,
                phone: '081234567890',
                role_id: roleMap['admin'],
                is_active: true,
            },
            {
                full_name: 'Dispatcher User',
                email: 'dispatcher@kurirbarang.com',
                password: hashedPassword,
                phone: '081234567891',
                role_id: roleMap['dispatcher'],
                is_active: true,
            },
            {
                full_name: 'Kurir 1',
                email: 'kurir1@kurirbarang.com',
                password: hashedPassword,
                phone: '081234567892',
                role_id: roleMap['kurir'],
                is_active: true,
            },
            {
                full_name: 'Kurir 2',
                email: 'kurir2@kurirbarang.com',
                password: hashedPassword,
                phone: '081234567893',
                role_id: roleMap['kurir'],
                is_active: true,
            },
            {
                full_name: 'Petugas Gudang',
                email: 'gudang@kurirbarang.com',
                password: hashedPassword,
                phone: '081234567894',
                role_id: roleMap['petugas_gudang'],
                is_active: true,
            },
        ]);
        const userRows = await db_1.db
            .select()
            .from(schema_1.user)
            .where((0, drizzle_orm_1.inArray)(schema_1.user.email, [
            'admin@kurirbarang.com',
            'dispatcher@kurirbarang.com',
            'kurir1@kurirbarang.com',
            'kurir2@kurirbarang.com',
            'gudang@kurirbarang.com',
        ]));
        const userMap = Object.fromEntries(userRows.map((u) => [u.email, u.id]));
        console.log('✅ Users created\n');
        console.log('🏢 Creating warehouses...');
        await db_1.db.insert(schema_1.warehouse).values([
            {
                name: 'Gudang Pusat Jakarta',
                code: 'GDG-JKT-001',
                type: 'main',
                address: 'Jl. Raya Jakarta No.123',
                city: 'Jakarta',
                province: 'DKI Jakarta',
                postal_code: '12345',
                phone: '021-12345678',
                email: 'gudang.jkt@kurirbarang.com',
                manager_id: userMap['admin@kurirbarang.com'],
                is_active: true,
            },
            {
                name: 'Gudang Cabang Bandung',
                code: 'GDG-BDG-001',
                type: 'branch',
                address: 'Jl. Raya Bandung No.456',
                city: 'Bandung',
                province: 'Jawa Barat',
                postal_code: '40511',
                phone: '022-87654321',
                email: 'gudang.bdg@kurirbarang.com',
                is_active: true,
            },
        ]);
        const warehouseRows = await db_1.db
            .select()
            .from(schema_1.warehouse)
            .where((0, drizzle_orm_1.inArray)(schema_1.warehouse.code, ['GDG-JKT-001', 'GDG-BDG-001']));
        const warehouseMap = Object.fromEntries(warehouseRows.map((w) => [w.code, w.id]));
        console.log('✅ Warehouses created\n');
        console.log('🚚 Creating kurirs...');
        await db_1.db.insert(schema_1.kurir).values({
            user_id: userMap['kurir1@kurirbarang.com'],
            employee_id: 'KUR-001',
            license_number: 'SIM-001',
            vehicle_type: 'Motor',
            vehicle_plate: 'B1234ABC',
            status: 'available',
            current_location: '-6.2088,106.8456',
            rating: '4.5',
            total_deliveries: 0,
        });
        await db_1.db.insert(schema_1.kurir).values({
            user_id: userMap['kurir2@kurirbarang.com'],
            employee_id: 'KUR-002',
            license_number: 'SIM-002',
            vehicle_type: 'Mobil',
            vehicle_plate: 'B5678DEF',
            status: 'available',
            current_location: '-6.9175,107.6191',
            rating: '4.8',
            total_deliveries: 0,
        });
        console.log('✅ Kurirs created\n');
        console.log('📦 Creating product categories...');
        await db_1.db.insert(schema_1.category).values([
            { name: 'Elektronik', description: 'Produk elektronik' },
            { name: 'Pakaian', description: 'Pakaian dan fashion' },
            { name: 'Makanan', description: 'Produk makanan dan minuman' },
            { name: 'Mainan', description: 'Mainan anak-anak' },
        ]);
        const categoryRows = await db_1.db
            .select()
            .from(schema_1.category)
            .where((0, drizzle_orm_1.inArray)(schema_1.category.name, ['Elektronik', 'Pakaian', 'Makanan', 'Mainan']));
        const categoryMap = Object.fromEntries(categoryRows.map((c) => [c.name, c.id]));
        console.log('✅ Categories created\n');
        console.log('🛍️ Creating products...');
        const productsToInsert = [
            {
                name: 'Laptop ASUS',
                sku: 'PROD-001',
                barcode: '1234567890123',
                description: 'Laptop ASUS untuk gaming',
                category_id: categoryMap['Elektronik'],
                unit: 'pcs',
                weight: 2.5.toString(),
                dimensions: '35x25x5',
                status: 'available',
                image_url: '/uploads/random_wallpaper-1.png',
            },
            {
                name: 'Kaos Kaki',
                sku: 'PROD-002',
                description: 'Kaos kaki premium',
                category_id: categoryMap['Pakaian'],
                unit: 'pasang',
                weight: 0.1.toString(),
                dimensions: '20x15x5',
                status: 'available',
                image_url: '/uploads/random_wallpaper.jpg',
            },
            {
                name: 'Susu UHT',
                sku: 'PROD-003',
                description: 'Susu UHT 1 liter',
                category_id: categoryMap['Makanan'],
                unit: 'botol',
                weight: 1.2.toString(),
                dimensions: '10x10x25',
                status: 'available',
                image_url: '/uploads/random_wallpaper.png',
            },
            {
                name: 'Mainan Robot',
                sku: 'PROD-004',
                description: 'Robot remote control',
                category_id: categoryMap['Mainan'],
                unit: 'pcs',
                weight: 0.8.toString(),
                dimensions: '30x20x15',
                status: 'available',
                image_url: '/uploads/random_wallpaper.png',
            },
            {
                name: 'Smartphone Samsung S24',
                sku: 'PROD-005',
                description: 'Smartphone flagship',
                category_id: categoryMap['Elektronik'],
                unit: 'pcs',
                weight: 0.2.toString(),
                dimensions: '15x7x1',
                status: 'available',
                image_url: '/uploads/random_wallpaper.jpg',
            },
            {
                name: 'Monitor LG 27 inch',
                sku: 'PROD-006',
                description: 'Monitor 27 inch 144Hz',
                category_id: categoryMap['Elektronik'],
                unit: 'pcs',
                weight: 4.5.toString(),
                dimensions: '60x40x10',
                status: 'available',
                image_url: '/uploads/random_wallpaper-1.png',
            },
        ];
        await db_1.db.insert(schema_1.product).values(productsToInsert);
        const productRows = await db_1.db
            .select()
            .from(schema_1.product)
            .where((0, drizzle_orm_1.inArray)(schema_1.product.sku, productsToInsert.map((p) => p.sku)));
        const productMap = Object.fromEntries(productRows.map((p) => [p.sku, p.id]));
        console.log('✅ Products created\n');
        console.log('📦 Creating inventories...');
        await db_1.db.insert(schema_1.inventory).values([
            { warehouse_id: warehouseMap['GDG-JKT-001'], product_id: productMap['PROD-001'], quantity: 20, reserved_quantity: 2, min_stock_level: 5 },
            { warehouse_id: warehouseMap['GDG-JKT-001'], product_id: productMap['PROD-002'], quantity: 100, reserved_quantity: 0, min_stock_level: 10 },
            { warehouse_id: warehouseMap['GDG-JKT-001'], product_id: productMap['PROD-003'], quantity: 60, reserved_quantity: 5, min_stock_level: 10 },
            { warehouse_id: warehouseMap['GDG-BDG-001'], product_id: productMap['PROD-004'], quantity: 30, reserved_quantity: 3, min_stock_level: 5 },
            { warehouse_id: warehouseMap['GDG-BDG-001'], product_id: productMap['PROD-005'], quantity: 25, reserved_quantity: 2, min_stock_level: 5 },
            { warehouse_id: warehouseMap['GDG-BDG-001'], product_id: productMap['PROD-006'], quantity: 15, reserved_quantity: 1, min_stock_level: 3 },
        ]);
        console.log('✅ Inventories created\n');
        console.log('👤 Creating customers...');
        await db_1.db.insert(schema_1.customer).values([
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
        const customerRows = await db_1.db
            .select()
            .from(schema_1.customer)
            .where((0, drizzle_orm_1.inArray)(schema_1.customer.email, ['toko@example.com', 'jaya@example.com', 'makmur@example.com']));
        const customerMap = Object.fromEntries(customerRows.map((c) => [c.email, c.id]));
        console.log('✅ Customers created\n');
        console.log('📬 Creating deliveries...');
        const deliveryData = [
            {
                tracking_number: 'DLV-001',
                customer_id: customerMap['toko@example.com'],
                warehouse_id: warehouseMap['GDG-JKT-001'],
                status: 'in_transit',
                pickup_address: 'Jl. Raya Jakarta No.123',
                delivery_address: 'Jl. Sudirman No.45, Jakarta Pusat',
                delivery_city: 'Jakarta',
                delivery_province: 'DKI Jakarta',
                delivery_postal_code: '12190',
                notes: 'Hati-hati, barang mudah pecah',
                total_weight: '5.5',
                total_value: '1500000',
                created_by: userMap['admin@kurirbarang.com'],
            },
            {
                tracking_number: 'DLV-002',
                customer_id: customerMap['jaya@example.com'],
                warehouse_id: warehouseMap['GDG-JKT-001'],
                status: 'delivered',
                pickup_address: 'Jl. Raya Jakarta No.123',
                delivery_address: 'Jl. Gatot Subroto No.10, Jakarta Selatan',
                delivery_city: 'Jakarta',
                delivery_province: 'DKI Jakarta',
                delivery_postal_code: '12930',
                notes: null,
                total_weight: '3.2',
                total_value: '850000',
                created_by: userMap['admin@kurirbarang.com'],
            },
            {
                tracking_number: 'DLV-003',
                customer_id: customerMap['makmur@example.com'],
                warehouse_id: warehouseMap['GDG-BDG-001'],
                status: 'pending',
                pickup_address: 'Jl. Raya Bandung No.456',
                delivery_address: 'Jl. Ahmad Yani No.88, Bandung',
                delivery_city: 'Bandung',
                delivery_province: 'Jawa Barat',
                delivery_postal_code: '40124',
                notes: 'Kirim sebelum jam 5 sore',
                total_weight: '2.0',
                total_value: '500000',
                created_by: userMap['dispatcher@kurirbarang.com'],
            },
        ];
        await db_1.db.insert(schema_1.delivery).values(deliveryData);
        const deliveries = await db_1.db
            .select()
            .from(schema_1.delivery)
            .where((0, drizzle_orm_1.inArray)(schema_1.delivery.tracking_number, ['DLV-001', 'DLV-002', 'DLV-003']));
        const deliveryMap = Object.fromEntries(deliveries.map((d) => [d.tracking_number, d.id]));
        await db_1.db.insert(schema_1.deliveryItem).values([
            { delivery_id: deliveryMap['DLV-001'], product_id: productMap['PROD-001'], quantity: 2, unit_price: '750000', total_price: '1500000', notes: 'Laptop ASUS' },
            { delivery_id: deliveryMap['DLV-002'], product_id: productMap['PROD-003'], quantity: 3, unit_price: '150000', total_price: '450000', notes: 'Susu UHT' },
            { delivery_id: deliveryMap['DLV-002'], product_id: productMap['PROD-002'], quantity: 4, unit_price: '100000', total_price: '400000', notes: 'Kaos kaki' },
            { delivery_id: deliveryMap['DLV-003'], product_id: productMap['PROD-004'], quantity: 1, unit_price: '250000', total_price: '250000', notes: 'Mainan robot' },
            { delivery_id: deliveryMap['DLV-003'], product_id: productMap['PROD-005'], quantity: 1, unit_price: '250000', total_price: '250000', notes: 'Smartphone' },
        ]);
        console.log('✅ Deliveries & items created\n');
        console.log('🎉 Database seeded successfully!\n');
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
    }
    catch (error) {
        console.error('❌ Error seeding database:', error);
        process.exit(1);
    }
}
seed();
//# sourceMappingURL=seed.js.map