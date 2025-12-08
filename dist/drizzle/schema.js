"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.kurirPerformanceRelations = exports.expeditionReportRelations = exports.expeditionItemRelations = exports.expeditionRelations = exports.deliveryReportRelations = exports.deliveryMediaRelations = exports.deliveryStatusHistoryRelations = exports.deliveryItemRelations = exports.deliveryRelations = exports.customerRelations = exports.stockMovementRelations = exports.inventoryRelations = exports.productRelations = exports.categoryRelations = exports.warehouseRelations = exports.kurirRelations = exports.userRelations = exports.roleRelations = exports.kurirPerformance = exports.expeditionReport = exports.deliveryReport = exports.expeditionItem = exports.expedition = exports.deliveryMedia = exports.deliveryStatusHistory = exports.deliveryItem = exports.delivery = exports.customer = exports.stockMovement = exports.inventory = exports.product = exports.category = exports.warehouse = exports.kurir = exports.user = exports.role = exports.kurirStatusEnum = exports.expeditionStatusEnum = exports.warehouseTypeEnum = exports.productStatusEnum = exports.deliveryStatusEnum = exports.userRoleEnum = void 0;
const mysql_core_1 = require("drizzle-orm/mysql-core");
const drizzle_orm_1 = require("drizzle-orm");
exports.userRoleEnum = (0, mysql_core_1.mysqlEnum)('user_role', ['admin', 'dispatcher', 'kurir', 'petugas_gudang']);
exports.deliveryStatusEnum = (0, mysql_core_1.mysqlEnum)('delivery_status', ['pending', 'picked_up', 'in_transit', 'delivered', 'failed', 'cancelled']);
exports.productStatusEnum = (0, mysql_core_1.mysqlEnum)('product_status', ['available', 'out_of_stock', 'discontinued']);
exports.warehouseTypeEnum = (0, mysql_core_1.mysqlEnum)('warehouse_type', ['main', 'branch', 'distribution_center']);
exports.expeditionStatusEnum = (0, mysql_core_1.mysqlEnum)('expedition_status', ['pending', 'processing', 'shipped', 'delivered', 'returned']);
exports.kurirStatusEnum = (0, mysql_core_1.mysqlEnum)('kurir_status', ['available', 'busy', 'offline', 'on_break']);
const timestamps = {
    created_at: (0, mysql_core_1.timestamp)('created_at').defaultNow().notNull(),
    updated_at: (0, mysql_core_1.timestamp)('updated_at').defaultNow().onUpdateNow().notNull(),
};
exports.role = (0, mysql_core_1.mysqlTable)('role', {
    id: (0, mysql_core_1.int)('id').primaryKey().autoincrement(),
    name: (0, mysql_core_1.varchar)('name', { length: 255 }).notNull(),
    description: (0, mysql_core_1.text)('description'),
    ...timestamps
});
exports.user = (0, mysql_core_1.mysqlTable)('user', {
    id: (0, mysql_core_1.int)('id').primaryKey().autoincrement(),
    full_name: (0, mysql_core_1.varchar)('full_name', { length: 255 }).notNull(),
    email: (0, mysql_core_1.varchar)('email', { length: 255 }).notNull().unique(),
    password: (0, mysql_core_1.varchar)('password', { length: 255 }).notNull(),
    phone: (0, mysql_core_1.varchar)('phone', { length: 20 }),
    role_id: (0, mysql_core_1.int)('role_id').notNull().references(() => exports.role.id, { onUpdate: 'cascade', onDelete: 'cascade' }),
    is_active: (0, mysql_core_1.boolean)('is_active').notNull().default(true),
    ...timestamps
});
exports.kurir = (0, mysql_core_1.mysqlTable)('kurir', {
    id: (0, mysql_core_1.int)('id').primaryKey().autoincrement(),
    user_id: (0, mysql_core_1.int)('user_id').notNull().unique().references(() => exports.user.id, { onUpdate: 'cascade', onDelete: 'cascade' }),
    employee_id: (0, mysql_core_1.varchar)('employee_id', { length: 50 }).notNull().unique(),
    license_number: (0, mysql_core_1.varchar)('license_number', { length: 50 }),
    vehicle_type: (0, mysql_core_1.varchar)('vehicle_type', { length: 50 }),
    vehicle_plate: (0, mysql_core_1.varchar)('vehicle_plate', { length: 20 }),
    status: exports.kurirStatusEnum.notNull().default('available'),
    current_location: (0, mysql_core_1.varchar)('current_location', { length: 255 }),
    max_capacity: (0, mysql_core_1.decimal)('max_capacity', { precision: 10, scale: 2 }),
    rating: (0, mysql_core_1.decimal)('rating', { precision: 3, scale: 2 }).default('0'),
    total_deliveries: (0, mysql_core_1.int)('total_deliveries').default(0),
    ...timestamps
});
exports.warehouse = (0, mysql_core_1.mysqlTable)('warehouse', {
    id: (0, mysql_core_1.int)('id').primaryKey().autoincrement(),
    name: (0, mysql_core_1.varchar)('name', { length: 255 }).notNull(),
    code: (0, mysql_core_1.varchar)('code', { length: 50 }).notNull().unique(),
    type: exports.warehouseTypeEnum.notNull(),
    address: (0, mysql_core_1.text)('address').notNull(),
    city: (0, mysql_core_1.varchar)('city', { length: 100 }).notNull(),
    province: (0, mysql_core_1.varchar)('province', { length: 100 }).notNull(),
    postal_code: (0, mysql_core_1.varchar)('postal_code', { length: 10 }),
    phone: (0, mysql_core_1.varchar)('phone', { length: 20 }),
    email: (0, mysql_core_1.varchar)('email', { length: 255 }),
    manager_id: (0, mysql_core_1.int)('manager_id').references(() => exports.user.id, { onUpdate: 'cascade', onDelete: 'set null' }),
    is_active: (0, mysql_core_1.boolean)('is_active').notNull().default(true),
    ...timestamps
});
exports.category = (0, mysql_core_1.mysqlTable)('category', {
    id: (0, mysql_core_1.int)('id').primaryKey().autoincrement(),
    name: (0, mysql_core_1.varchar)('name', { length: 255 }).notNull(),
    description: (0, mysql_core_1.text)('description'),
    parent_id: (0, mysql_core_1.int)('parent_id'),
    ...timestamps
});
exports.product = (0, mysql_core_1.mysqlTable)('product', {
    id: (0, mysql_core_1.int)('id').primaryKey().autoincrement(),
    name: (0, mysql_core_1.varchar)('name', { length: 255 }).notNull(),
    sku: (0, mysql_core_1.varchar)('sku', { length: 100 }).notNull().unique(),
    barcode: (0, mysql_core_1.varchar)('barcode', { length: 100 }),
    image_url: (0, mysql_core_1.varchar)('image_url', { length: 500 }),
    description: (0, mysql_core_1.text)('description'),
    category_id: (0, mysql_core_1.int)('category_id').notNull().references(() => exports.category.id, { onUpdate: 'cascade', onDelete: 'cascade' }),
    unit: (0, mysql_core_1.varchar)('unit', { length: 50 }).notNull(),
    weight: (0, mysql_core_1.decimal)('weight', { precision: 10, scale: 2 }),
    dimensions: (0, mysql_core_1.varchar)('dimensions', { length: 100 }),
    status: exports.productStatusEnum.notNull().default('available'),
    ...timestamps
});
exports.inventory = (0, mysql_core_1.mysqlTable)('inventory', {
    id: (0, mysql_core_1.int)('id').primaryKey().autoincrement(),
    warehouse_id: (0, mysql_core_1.int)('warehouse_id').notNull().references(() => exports.warehouse.id, { onUpdate: 'cascade', onDelete: 'cascade' }),
    product_id: (0, mysql_core_1.int)('product_id').notNull().references(() => exports.product.id, { onUpdate: 'cascade', onDelete: 'cascade' }),
    quantity: (0, mysql_core_1.int)('quantity').notNull().default(0),
    reserved_quantity: (0, mysql_core_1.int)('reserved_quantity').notNull().default(0),
    min_stock_level: (0, mysql_core_1.int)('min_stock_level').notNull().default(0),
    max_stock_level: (0, mysql_core_1.int)('max_stock_level'),
    location: (0, mysql_core_1.varchar)('location', { length: 100 }),
    ...timestamps
}, (table) => ({
    uniqueWarehouseProduct: (0, mysql_core_1.unique)().on(table.warehouse_id, table.product_id)
}));
exports.stockMovement = (0, mysql_core_1.mysqlTable)('stock_movement', {
    id: (0, mysql_core_1.int)('id').primaryKey().autoincrement(),
    inventory_id: (0, mysql_core_1.int)('inventory_id').notNull().references(() => exports.inventory.id, { onUpdate: 'cascade', onDelete: 'cascade' }),
    type: (0, mysql_core_1.mysqlEnum)('movement_type', ['in', 'out', 'adjustment', 'transfer']).notNull(),
    quantity: (0, mysql_core_1.int)('quantity').notNull(),
    reference_type: (0, mysql_core_1.varchar)('reference_type', { length: 50 }),
    reference_id: (0, mysql_core_1.int)('reference_id'),
    notes: (0, mysql_core_1.text)('notes'),
    user_id: (0, mysql_core_1.int)('user_id').notNull().references(() => exports.user.id, { onUpdate: 'cascade', onDelete: 'cascade' }),
    ...timestamps
});
exports.customer = (0, mysql_core_1.mysqlTable)('customer', {
    id: (0, mysql_core_1.int)('id').primaryKey().autoincrement(),
    name: (0, mysql_core_1.varchar)('name', { length: 255 }).notNull(),
    email: (0, mysql_core_1.varchar)('email', { length: 255 }),
    phone: (0, mysql_core_1.varchar)('phone', { length: 20 }),
    address: (0, mysql_core_1.text)('address').notNull(),
    city: (0, mysql_core_1.varchar)('city', { length: 100 }).notNull(),
    province: (0, mysql_core_1.varchar)('province', { length: 100 }).notNull(),
    postal_code: (0, mysql_core_1.varchar)('postal_code', { length: 10 }),
    is_active: (0, mysql_core_1.boolean)('is_active').notNull().default(true),
    ...timestamps
});
exports.delivery = (0, mysql_core_1.mysqlTable)('delivery', {
    id: (0, mysql_core_1.int)('id').primaryKey().autoincrement(),
    tracking_number: (0, mysql_core_1.varchar)('tracking_number', { length: 50 }).notNull().unique(),
    customer_id: (0, mysql_core_1.int)('customer_id').notNull().references(() => exports.customer.id, { onUpdate: 'cascade', onDelete: 'cascade' }),
    warehouse_id: (0, mysql_core_1.int)('warehouse_id').notNull().references(() => exports.warehouse.id, { onUpdate: 'cascade', onDelete: 'cascade' }),
    kurir_id: (0, mysql_core_1.int)('kurir_id').references(() => exports.kurir.id, { onUpdate: 'cascade', onDelete: 'set null' }),
    status: exports.deliveryStatusEnum.notNull().default('pending'),
    pickup_address: (0, mysql_core_1.text)('pickup_address').notNull(),
    delivery_address: (0, mysql_core_1.text)('delivery_address').notNull(),
    delivery_city: (0, mysql_core_1.varchar)('delivery_city', { length: 100 }).notNull(),
    delivery_province: (0, mysql_core_1.varchar)('delivery_province', { length: 100 }).notNull(),
    delivery_postal_code: (0, mysql_core_1.varchar)('delivery_postal_code', { length: 10 }),
    notes: (0, mysql_core_1.text)('notes'),
    total_weight: (0, mysql_core_1.decimal)('total_weight', { precision: 10, scale: 2 }),
    total_value: (0, mysql_core_1.decimal)('total_value', { precision: 15, scale: 2 }),
    shipping_cost: (0, mysql_core_1.decimal)('shipping_cost', { precision: 15, scale: 2 }),
    scheduled_pickup: (0, mysql_core_1.datetime)('scheduled_pickup'),
    scheduled_delivery: (0, mysql_core_1.datetime)('scheduled_delivery'),
    picked_up_at: (0, mysql_core_1.datetime)('picked_up_at'),
    delivered_at: (0, mysql_core_1.datetime)('delivered_at'),
    created_by: (0, mysql_core_1.int)('created_by').notNull().references(() => exports.user.id, { onUpdate: 'cascade', onDelete: 'cascade' }),
    ...timestamps
});
exports.deliveryItem = (0, mysql_core_1.mysqlTable)('delivery_item', {
    id: (0, mysql_core_1.int)('id').primaryKey().autoincrement(),
    delivery_id: (0, mysql_core_1.int)('delivery_id').notNull().references(() => exports.delivery.id, { onUpdate: 'cascade', onDelete: 'cascade' }),
    product_id: (0, mysql_core_1.int)('product_id').notNull().references(() => exports.product.id, { onUpdate: 'cascade', onDelete: 'cascade' }),
    quantity: (0, mysql_core_1.int)('quantity').notNull(),
    unit_price: (0, mysql_core_1.decimal)('unit_price', { precision: 15, scale: 2 }).notNull(),
    total_price: (0, mysql_core_1.decimal)('total_price', { precision: 15, scale: 2 }).notNull(),
    notes: (0, mysql_core_1.text)('notes'),
    ...timestamps
});
exports.deliveryStatusHistory = (0, mysql_core_1.mysqlTable)('delivery_status_history', {
    id: (0, mysql_core_1.int)('id').primaryKey().autoincrement(),
    delivery_id: (0, mysql_core_1.int)('delivery_id').notNull().references(() => exports.delivery.id, { onUpdate: 'cascade', onDelete: 'cascade' }),
    status: exports.deliveryStatusEnum.notNull(),
    notes: (0, mysql_core_1.text)('notes'),
    location: (0, mysql_core_1.varchar)('location', { length: 255 }),
    updated_by: (0, mysql_core_1.int)('updated_by').notNull().references(() => exports.user.id, { onUpdate: 'cascade', onDelete: 'cascade' }),
    ...timestamps
});
exports.deliveryMedia = (0, mysql_core_1.mysqlTable)('delivery_media', {
    id: (0, mysql_core_1.int)('id').primaryKey().autoincrement(),
    delivery_id: (0, mysql_core_1.int)('delivery_id').notNull().references(() => exports.delivery.id, { onUpdate: 'cascade', onDelete: 'cascade' }),
    media_type: (0, mysql_core_1.mysqlEnum)('media_type', ['image', 'video', 'document']).notNull(),
    file_url: (0, mysql_core_1.varchar)('file_url', { length: 500 }).notNull(),
    file_name: (0, mysql_core_1.varchar)('file_name', { length: 255 }).notNull(),
    file_size: (0, mysql_core_1.int)('file_size'),
    uploaded_by: (0, mysql_core_1.int)('uploaded_by').notNull().references(() => exports.user.id, { onUpdate: 'cascade', onDelete: 'cascade' }),
    ...timestamps
});
exports.expedition = (0, mysql_core_1.mysqlTable)('expedition', {
    id: (0, mysql_core_1.int)('id').primaryKey().autoincrement(),
    expedition_code: (0, mysql_core_1.varchar)('expedition_code', { length: 50 }).notNull().unique(),
    warehouse_id: (0, mysql_core_1.int)('warehouse_id').notNull().references(() => exports.warehouse.id, { onUpdate: 'cascade', onDelete: 'cascade' }),
    kurir_id: (0, mysql_core_1.int)('kurir_id').references(() => exports.kurir.id, { onUpdate: 'cascade', onDelete: 'set null' }),
    status: exports.expeditionStatusEnum.notNull().default('pending'),
    departure_date: (0, mysql_core_1.datetime)('departure_date'),
    arrival_date: (0, mysql_core_1.datetime)('arrival_date'),
    total_packages: (0, mysql_core_1.int)('total_packages').notNull().default(0),
    total_weight: (0, mysql_core_1.decimal)('total_weight', { precision: 10, scale: 2 }),
    total_value: (0, mysql_core_1.decimal)('total_value', { precision: 15, scale: 2 }),
    notes: (0, mysql_core_1.text)('notes'),
    created_by: (0, mysql_core_1.int)('created_by').notNull().references(() => exports.user.id, { onUpdate: 'cascade', onDelete: 'cascade' }),
    ...timestamps
});
exports.expeditionItem = (0, mysql_core_1.mysqlTable)('expedition_item', {
    id: (0, mysql_core_1.int)('id').primaryKey().autoincrement(),
    expedition_id: (0, mysql_core_1.int)('expedition_id').notNull().references(() => exports.expedition.id, { onUpdate: 'cascade', onDelete: 'cascade' }),
    delivery_id: (0, mysql_core_1.int)('delivery_id').notNull().references(() => exports.delivery.id, { onUpdate: 'cascade', onDelete: 'cascade' }),
    ...timestamps
});
exports.deliveryReport = (0, mysql_core_1.mysqlTable)('delivery_report', {
    id: (0, mysql_core_1.int)('id').primaryKey().autoincrement(),
    warehouse_id: (0, mysql_core_1.int)('warehouse_id').notNull().references(() => exports.warehouse.id, { onUpdate: 'cascade', onDelete: 'cascade' }),
    report_date: (0, mysql_core_1.date)('report_date').notNull(),
    total_deliveries: (0, mysql_core_1.int)('total_deliveries').notNull().default(0),
    successful_deliveries: (0, mysql_core_1.int)('successful_deliveries').notNull().default(0),
    failed_deliveries: (0, mysql_core_1.int)('failed_deliveries').notNull().default(0),
    total_revenue: (0, mysql_core_1.decimal)('total_revenue', { precision: 15, scale: 2 }).notNull().default('0'),
    total_weight: (0, mysql_core_1.decimal)('total_weight', { precision: 10, scale: 2 }).notNull().default('0'),
    ...timestamps
});
exports.expeditionReport = (0, mysql_core_1.mysqlTable)('expedition_report', {
    id: (0, mysql_core_1.int)('id').primaryKey().autoincrement(),
    warehouse_id: (0, mysql_core_1.int)('warehouse_id').notNull().references(() => exports.warehouse.id, { onUpdate: 'cascade', onDelete: 'cascade' }),
    report_date: (0, mysql_core_1.date)('report_date').notNull(),
    total_expeditions: (0, mysql_core_1.int)('total_expeditions').notNull().default(0),
    completed_expeditions: (0, mysql_core_1.int)('completed_expeditions').notNull().default(0),
    total_packages: (0, mysql_core_1.int)('total_packages').notNull().default(0),
    total_weight: (0, mysql_core_1.decimal)('total_weight', { precision: 10, scale: 2 }).notNull().default('0'),
    average_delivery_time: (0, mysql_core_1.decimal)('average_delivery_time', { precision: 8, scale: 2 }),
    ...timestamps
});
exports.kurirPerformance = (0, mysql_core_1.mysqlTable)('kurir_performance', {
    id: (0, mysql_core_1.int)('id').primaryKey().autoincrement(),
    kurir_id: (0, mysql_core_1.int)('kurir_id').notNull().references(() => exports.kurir.id, { onUpdate: 'cascade', onDelete: 'cascade' }),
    report_date: (0, mysql_core_1.date)('report_date').notNull(),
    total_deliveries: (0, mysql_core_1.int)('total_deliveries').notNull().default(0),
    successful_deliveries: (0, mysql_core_1.int)('successful_deliveries').notNull().default(0),
    failed_deliveries: (0, mysql_core_1.int)('failed_deliveries').notNull().default(0),
    total_distance: (0, mysql_core_1.decimal)('total_distance', { precision: 10, scale: 2 }),
    average_rating: (0, mysql_core_1.decimal)('average_rating', { precision: 3, scale: 2 }),
    ...timestamps
});
exports.roleRelations = (0, drizzle_orm_1.relations)(exports.role, ({ many }) => ({
    users: many(exports.user)
}));
exports.userRelations = (0, drizzle_orm_1.relations)(exports.user, ({ one, many }) => ({
    role: one(exports.role, {
        fields: [exports.user.role_id],
        references: [exports.role.id]
    }),
    kurir: one(exports.kurir),
    managedWarehouses: many(exports.warehouse),
    deliveries: many(exports.delivery),
    stockMovements: many(exports.stockMovement),
    deliveryStatusHistories: many(exports.deliveryStatusHistory),
    deliveryMedia: many(exports.deliveryMedia),
    createdExpeditions: many(exports.expedition)
}));
exports.kurirRelations = (0, drizzle_orm_1.relations)(exports.kurir, ({ one, many }) => ({
    user: one(exports.user, {
        fields: [exports.kurir.user_id],
        references: [exports.user.id]
    }),
    expeditions: many(exports.expedition),
    performance: many(exports.kurirPerformance)
}));
exports.warehouseRelations = (0, drizzle_orm_1.relations)(exports.warehouse, ({ one, many }) => ({
    manager: one(exports.user, {
        fields: [exports.warehouse.manager_id],
        references: [exports.user.id]
    }),
    inventories: many(exports.inventory),
    deliveries: many(exports.delivery),
    expeditions: many(exports.expedition),
    deliveryReports: many(exports.deliveryReport),
    expeditionReports: many(exports.expeditionReport)
}));
exports.categoryRelations = (0, drizzle_orm_1.relations)(exports.category, ({ one, many }) => ({
    parent: one(exports.category, {
        fields: [exports.category.parent_id],
        references: [exports.category.id]
    }),
    children: many(exports.category),
    products: many(exports.product)
}));
exports.productRelations = (0, drizzle_orm_1.relations)(exports.product, ({ one, many }) => ({
    category: one(exports.category, {
        fields: [exports.product.category_id],
        references: [exports.category.id]
    }),
    inventories: many(exports.inventory),
    deliveryItems: many(exports.deliveryItem)
}));
exports.inventoryRelations = (0, drizzle_orm_1.relations)(exports.inventory, ({ one, many }) => ({
    warehouse: one(exports.warehouse, {
        fields: [exports.inventory.warehouse_id],
        references: [exports.warehouse.id]
    }),
    product: one(exports.product, {
        fields: [exports.inventory.product_id],
        references: [exports.product.id]
    }),
    stockMovements: many(exports.stockMovement)
}));
exports.stockMovementRelations = (0, drizzle_orm_1.relations)(exports.stockMovement, ({ one }) => ({
    inventory: one(exports.inventory, {
        fields: [exports.stockMovement.inventory_id],
        references: [exports.inventory.id]
    }),
    user: one(exports.user, {
        fields: [exports.stockMovement.user_id],
        references: [exports.user.id]
    })
}));
exports.customerRelations = (0, drizzle_orm_1.relations)(exports.customer, ({ many }) => ({
    deliveries: many(exports.delivery)
}));
exports.deliveryRelations = (0, drizzle_orm_1.relations)(exports.delivery, ({ one, many }) => ({
    customer: one(exports.customer, {
        fields: [exports.delivery.customer_id],
        references: [exports.customer.id]
    }),
    warehouse: one(exports.warehouse, {
        fields: [exports.delivery.warehouse_id],
        references: [exports.warehouse.id]
    }),
    kurir: one(exports.user, {
        fields: [exports.delivery.kurir_id],
        references: [exports.user.id]
    }),
    creator: one(exports.user, {
        fields: [exports.delivery.created_by],
        references: [exports.user.id]
    }),
    items: many(exports.deliveryItem),
    statusHistories: many(exports.deliveryStatusHistory),
    media: many(exports.deliveryMedia)
}));
exports.deliveryItemRelations = (0, drizzle_orm_1.relations)(exports.deliveryItem, ({ one }) => ({
    delivery: one(exports.delivery, {
        fields: [exports.deliveryItem.delivery_id],
        references: [exports.delivery.id]
    }),
    product: one(exports.product, {
        fields: [exports.deliveryItem.product_id],
        references: [exports.product.id]
    })
}));
exports.deliveryStatusHistoryRelations = (0, drizzle_orm_1.relations)(exports.deliveryStatusHistory, ({ one }) => ({
    delivery: one(exports.delivery, {
        fields: [exports.deliveryStatusHistory.delivery_id],
        references: [exports.delivery.id]
    }),
    updatedBy: one(exports.user, {
        fields: [exports.deliveryStatusHistory.updated_by],
        references: [exports.user.id]
    })
}));
exports.deliveryMediaRelations = (0, drizzle_orm_1.relations)(exports.deliveryMedia, ({ one }) => ({
    delivery: one(exports.delivery, {
        fields: [exports.deliveryMedia.delivery_id],
        references: [exports.delivery.id]
    }),
    uploadedBy: one(exports.user, {
        fields: [exports.deliveryMedia.uploaded_by],
        references: [exports.user.id]
    })
}));
exports.deliveryReportRelations = (0, drizzle_orm_1.relations)(exports.deliveryReport, ({ one }) => ({
    warehouse: one(exports.warehouse, {
        fields: [exports.deliveryReport.warehouse_id],
        references: [exports.warehouse.id]
    })
}));
exports.expeditionRelations = (0, drizzle_orm_1.relations)(exports.expedition, ({ one, many }) => ({
    warehouse: one(exports.warehouse, {
        fields: [exports.expedition.warehouse_id],
        references: [exports.warehouse.id]
    }),
    kurir: one(exports.kurir, {
        fields: [exports.expedition.kurir_id],
        references: [exports.kurir.id]
    }),
    creator: one(exports.user, {
        fields: [exports.expedition.created_by],
        references: [exports.user.id]
    }),
    items: many(exports.expeditionItem)
}));
exports.expeditionItemRelations = (0, drizzle_orm_1.relations)(exports.expeditionItem, ({ one }) => ({
    expedition: one(exports.expedition, {
        fields: [exports.expeditionItem.expedition_id],
        references: [exports.expedition.id]
    }),
    delivery: one(exports.delivery, {
        fields: [exports.expeditionItem.delivery_id],
        references: [exports.delivery.id]
    })
}));
exports.expeditionReportRelations = (0, drizzle_orm_1.relations)(exports.expeditionReport, ({ one }) => ({
    warehouse: one(exports.warehouse, {
        fields: [exports.expeditionReport.warehouse_id],
        references: [exports.warehouse.id]
    })
}));
exports.kurirPerformanceRelations = (0, drizzle_orm_1.relations)(exports.kurirPerformance, ({ one }) => ({
    kurir: one(exports.kurir, {
        fields: [exports.kurirPerformance.kurir_id],
        references: [exports.kurir.id]
    })
}));
//# sourceMappingURL=schema.js.map