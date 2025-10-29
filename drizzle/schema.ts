import { mysqlTable, int, varchar, date, boolean, text, mysqlEnum, unique, timestamp, datetime, decimal } from 'drizzle-orm/mysql-core';
import { relations } from 'drizzle-orm';
export const userRoleEnum = mysqlEnum('user_role', ['admin', 'dispatcher', 'kurir', 'petugas_gudang']);
export const deliveryStatusEnum = mysqlEnum('delivery_status', ['pending', 'picked_up', 'in_transit', 'delivered', 'failed', 'cancelled']);
export const productStatusEnum = mysqlEnum('product_status', ['available', 'out_of_stock', 'discontinued']);
export const warehouseTypeEnum = mysqlEnum('warehouse_type', ['main', 'branch', 'distribution_center']);
export const expeditionStatusEnum = mysqlEnum('expedition_status', ['pending', 'processing', 'shipped', 'delivered', 'returned']);
export const kurirStatusEnum = mysqlEnum('kurir_status', ['available', 'busy', 'offline', 'on_break']);

const timestamps = {
    created_at: timestamp('created_at').defaultNow().notNull(),
    updated_at: timestamp('updated_at').defaultNow().onUpdateNow().notNull(),
};
export const role = mysqlTable('role', {
    id: int('id').primaryKey().autoincrement(),
    name: varchar('name', { length: 255 }).notNull(),
    description: text('description'),
    ...timestamps
});

export const user = mysqlTable('user', {
    id: int('id').primaryKey().autoincrement(),
    full_name: varchar('full_name', { length: 255 }).notNull(),
    email: varchar('email', { length: 255 }).notNull().unique(),
    password: varchar('password', { length: 255 }).notNull(),
    phone: varchar('phone', { length: 20 }),
    role_id: int('role_id').notNull().references(() => role.id, { onUpdate: 'cascade', onDelete: 'cascade' }),
    is_active: boolean('is_active').notNull().default(true),
    ...timestamps
});

export const kurir = mysqlTable('kurir', {
    id: int('id').primaryKey().autoincrement(),
    user_id: int('user_id').notNull().unique().references(() => user.id, { onUpdate: 'cascade', onDelete: 'cascade' }),
    employee_id: varchar('employee_id', { length: 50 }).notNull().unique(),
    license_number: varchar('license_number', { length: 50 }),
    vehicle_type: varchar('vehicle_type', { length: 50 }),
    vehicle_plate: varchar('vehicle_plate', { length: 20 }),
    status: kurirStatusEnum.notNull().default('available'),
    current_location: varchar('current_location', { length: 255 }),
    max_capacity: decimal('max_capacity', { precision: 10, scale: 2 }),
    rating: decimal('rating', { precision: 3, scale: 2 }).default('0'),
    total_deliveries: int('total_deliveries').default(0),
    ...timestamps
});

export const warehouse = mysqlTable('warehouse', {
    id: int('id').primaryKey().autoincrement(),
    name: varchar('name', { length: 255 }).notNull(),
    code: varchar('code', { length: 50 }).notNull().unique(),
    type: warehouseTypeEnum.notNull(),
    address: text('address').notNull(),
    city: varchar('city', { length: 100 }).notNull(),
    province: varchar('province', { length: 100 }).notNull(),
    postal_code: varchar('postal_code', { length: 10 }),
    phone: varchar('phone', { length: 20 }),
    email: varchar('email', { length: 255 }),
    manager_id: int('manager_id').references(() => user.id, { onUpdate: 'cascade', onDelete: 'set null' }),
    is_active: boolean('is_active').notNull().default(true),
    ...timestamps
});

export const category = mysqlTable('category', {
    id: int('id').primaryKey().autoincrement(),
    name: varchar('name', { length: 255 }).notNull(),
    description: text('description'),
    parent_id: int('parent_id'),
    ...timestamps
});

export const product = mysqlTable('product', {
    id: int('id').primaryKey().autoincrement(),
    name: varchar('name', { length: 255 }).notNull(),
    sku: varchar('sku', { length: 100 }).notNull().unique(),
    barcode: varchar('barcode', { length: 100 }),
    description: text('description'),
    category_id: int('category_id').notNull().references(() => category.id, { onUpdate: 'cascade', onDelete: 'cascade' }),
    unit: varchar('unit', { length: 50 }).notNull(),
    weight: decimal('weight', { precision: 10, scale: 2 }),
    dimensions: varchar('dimensions', { length: 100 }),
    status: productStatusEnum.notNull().default('available'),
    ...timestamps
});

export const productImage = mysqlTable('product_image', {
    id: int('id').primaryKey().autoincrement(),
    product_id: int('product_id').notNull().references(() => product.id, { onUpdate: 'cascade', onDelete: 'cascade' }),
    image_url: varchar('image_url', { length: 500 }).notNull(),
    api_url: varchar('api_url', { length: 500 }),
    is_primary: boolean('is_primary').notNull().default(false),
    ...timestamps
});

export const inventory = mysqlTable('inventory', {
    id: int('id').primaryKey().autoincrement(),
    warehouse_id: int('warehouse_id').notNull().references(() => warehouse.id, { onUpdate: 'cascade', onDelete: 'cascade' }),
    product_id: int('product_id').notNull().references(() => product.id, { onUpdate: 'cascade', onDelete: 'cascade' }),
    quantity: int('quantity').notNull().default(0),
    reserved_quantity: int('reserved_quantity').notNull().default(0),
    min_stock_level: int('min_stock_level').notNull().default(0),
    max_stock_level: int('max_stock_level'),
    location: varchar('location', { length: 100 }),
    ...timestamps
}, (table) => ({
    uniqueWarehouseProduct: unique().on(table.warehouse_id, table.product_id)
}));

export const stockMovement = mysqlTable('stock_movement', {
    id: int('id').primaryKey().autoincrement(),
    inventory_id: int('inventory_id').notNull().references(() => inventory.id, { onUpdate: 'cascade', onDelete: 'cascade' }),
    type: mysqlEnum('movement_type', ['in', 'out', 'adjustment', 'transfer']).notNull(),
    quantity: int('quantity').notNull(),
    reference_type: varchar('reference_type', { length: 50 }),
    reference_id: int('reference_id'),
    notes: text('notes'),
    user_id: int('user_id').notNull().references(() => user.id, { onUpdate: 'cascade', onDelete: 'cascade' }),
    ...timestamps
});

export const customer = mysqlTable('customer', {
    id: int('id').primaryKey().autoincrement(),
    name: varchar('name', { length: 255 }).notNull(),
    email: varchar('email', { length: 255 }),
    phone: varchar('phone', { length: 20 }),
    address: text('address').notNull(),
    city: varchar('city', { length: 100 }).notNull(),
    province: varchar('province', { length: 100 }).notNull(),
    postal_code: varchar('postal_code', { length: 10 }),
    is_active: boolean('is_active').notNull().default(true),
    ...timestamps
});

export const delivery = mysqlTable('delivery', {
    id: int('id').primaryKey().autoincrement(),
    tracking_number: varchar('tracking_number', { length: 50 }).notNull().unique(),
    customer_id: int('customer_id').notNull().references(() => customer.id, { onUpdate: 'cascade', onDelete: 'cascade' }),
    warehouse_id: int('warehouse_id').notNull().references(() => warehouse.id, { onUpdate: 'cascade', onDelete: 'cascade' }),
    kurir_id: int('kurir_id').references(() => user.id, { onUpdate: 'cascade', onDelete: 'set null' }),
    status: deliveryStatusEnum.notNull().default('pending'),
    pickup_address: text('pickup_address').notNull(),
    delivery_address: text('delivery_address').notNull(),
    delivery_city: varchar('delivery_city', { length: 100 }).notNull(),
    delivery_province: varchar('delivery_province', { length: 100 }).notNull(),
    delivery_postal_code: varchar('delivery_postal_code', { length: 10 }),
    notes: text('notes'),
    total_weight: decimal('total_weight', { precision: 10, scale: 2 }),
    total_value: decimal('total_value', { precision: 15, scale: 2 }),
    shipping_cost: decimal('shipping_cost', { precision: 15, scale: 2 }),
    scheduled_pickup: datetime('scheduled_pickup'),
    scheduled_delivery: datetime('scheduled_delivery'),
    picked_up_at: datetime('picked_up_at'),
    delivered_at: datetime('delivered_at'),
    created_by: int('created_by').notNull().references(() => user.id, { onUpdate: 'cascade', onDelete: 'cascade' }),
    ...timestamps
});

export const deliveryItem = mysqlTable('delivery_item', {
    id: int('id').primaryKey().autoincrement(),
    delivery_id: int('delivery_id').notNull().references(() => delivery.id, { onUpdate: 'cascade', onDelete: 'cascade' }),
    product_id: int('product_id').notNull().references(() => product.id, { onUpdate: 'cascade', onDelete: 'cascade' }),
    quantity: int('quantity').notNull(),
    unit_price: decimal('unit_price', { precision: 15, scale: 2 }).notNull(),
    total_price: decimal('total_price', { precision: 15, scale: 2 }).notNull(),
    notes: text('notes'),
    ...timestamps
});

export const deliveryStatusHistory = mysqlTable('delivery_status_history', {
    id: int('id').primaryKey().autoincrement(),
    delivery_id: int('delivery_id').notNull().references(() => delivery.id, { onUpdate: 'cascade', onDelete: 'cascade' }),
    status: deliveryStatusEnum.notNull(),
    notes: text('notes'),
    location: varchar('location', { length: 255 }),
    updated_by: int('updated_by').notNull().references(() => user.id, { onUpdate: 'cascade', onDelete: 'cascade' }),
    ...timestamps
});

export const deliveryMedia = mysqlTable('delivery_media', {
    id: int('id').primaryKey().autoincrement(),
    delivery_id: int('delivery_id').notNull().references(() => delivery.id, { onUpdate: 'cascade', onDelete: 'cascade' }),
    media_type: mysqlEnum('media_type', ['image', 'video', 'document']).notNull(),
    file_url: varchar('file_url', { length: 500 }).notNull(),
    file_name: varchar('file_name', { length: 255 }).notNull(),
    file_size: int('file_size'),
    uploaded_by: int('uploaded_by').notNull().references(() => user.id, { onUpdate: 'cascade', onDelete: 'cascade' }),
    ...timestamps
});

export const expedition = mysqlTable('expedition', {
    id: int('id').primaryKey().autoincrement(),
    expedition_code: varchar('expedition_code', { length: 50 }).notNull().unique(),
    warehouse_id: int('warehouse_id').notNull().references(() => warehouse.id, { onUpdate: 'cascade', onDelete: 'cascade' }),
    kurir_id: int('kurir_id').references(() => kurir.id, { onUpdate: 'cascade', onDelete: 'set null' }),
    status: expeditionStatusEnum.notNull().default('pending'),
    departure_date: datetime('departure_date'),
    arrival_date: datetime('arrival_date'),
    total_packages: int('total_packages').notNull().default(0),
    total_weight: decimal('total_weight', { precision: 10, scale: 2 }),
    total_value: decimal('total_value', { precision: 15, scale: 2 }),
    notes: text('notes'),
    created_by: int('created_by').notNull().references(() => user.id, { onUpdate: 'cascade', onDelete: 'cascade' }),
    ...timestamps
});

export const expeditionItem = mysqlTable('expedition_item', {
    id: int('id').primaryKey().autoincrement(),
    expedition_id: int('expedition_id').notNull().references(() => expedition.id, { onUpdate: 'cascade', onDelete: 'cascade' }),
    delivery_id: int('delivery_id').notNull().references(() => delivery.id, { onUpdate: 'cascade', onDelete: 'cascade' }),
    ...timestamps
});

export const deliveryReport = mysqlTable('delivery_report', {
    id: int('id').primaryKey().autoincrement(),
    warehouse_id: int('warehouse_id').notNull().references(() => warehouse.id, { onUpdate: 'cascade', onDelete: 'cascade' }),
    report_date: date('report_date').notNull(),
    total_deliveries: int('total_deliveries').notNull().default(0),
    successful_deliveries: int('successful_deliveries').notNull().default(0),
    failed_deliveries: int('failed_deliveries').notNull().default(0),
    total_revenue: decimal('total_revenue', { precision: 15, scale: 2 }).notNull().default('0'),
    total_weight: decimal('total_weight', { precision: 10, scale: 2 }).notNull().default('0'),
    ...timestamps
});

export const expeditionReport = mysqlTable('expedition_report', {
    id: int('id').primaryKey().autoincrement(),
    warehouse_id: int('warehouse_id').notNull().references(() => warehouse.id, { onUpdate: 'cascade', onDelete: 'cascade' }),
    report_date: date('report_date').notNull(),
    total_expeditions: int('total_expeditions').notNull().default(0),
    completed_expeditions: int('completed_expeditions').notNull().default(0),
    total_packages: int('total_packages').notNull().default(0),
    total_weight: decimal('total_weight', { precision: 10, scale: 2 }).notNull().default('0'),
    average_delivery_time: decimal('average_delivery_time', { precision: 8, scale: 2 }),
    ...timestamps
});

export const kurirPerformance = mysqlTable('kurir_performance', {
    id: int('id').primaryKey().autoincrement(),
    kurir_id: int('kurir_id').notNull().references(() => kurir.id, { onUpdate: 'cascade', onDelete: 'cascade' }),
    report_date: date('report_date').notNull(),
    total_deliveries: int('total_deliveries').notNull().default(0),
    successful_deliveries: int('successful_deliveries').notNull().default(0),
    failed_deliveries: int('failed_deliveries').notNull().default(0),
    total_distance: decimal('total_distance', { precision: 10, scale: 2 }),
    average_rating: decimal('average_rating', { precision: 3, scale: 2 }),
    ...timestamps
});

export const roleRelations = relations(role, ({ many }) => ({
    users: many(user)
}));

export const userRelations = relations(user, ({ one, many }) => ({
    role: one(role, {
        fields: [user.role_id],
        references: [role.id]
    }),
    kurir: one(kurir),
    managedWarehouses: many(warehouse),
    deliveries: many(delivery),
    stockMovements: many(stockMovement),
    deliveryStatusHistories: many(deliveryStatusHistory),
    deliveryMedia: many(deliveryMedia),
    createdExpeditions: many(expedition)
}));

export const kurirRelations = relations(kurir, ({ one, many }) => ({
    user: one(user, {
        fields: [kurir.user_id],
        references: [user.id]
    }),
    expeditions: many(expedition),
    performance: many(kurirPerformance)
}));

export const warehouseRelations = relations(warehouse, ({ one, many }) => ({
    manager: one(user, {
        fields: [warehouse.manager_id],
        references: [user.id]
    }),
    inventories: many(inventory),
    deliveries: many(delivery),
    expeditions: many(expedition),
    deliveryReports: many(deliveryReport),
    expeditionReports: many(expeditionReport)
}));

export const categoryRelations = relations(category, ({ one, many }) => ({
    parent: one(category, {
        fields: [category.parent_id],
        references: [category.id]
    }),
    children: many(category),
    products: many(product)
}));

export const productRelations = relations(product, ({ one, many }) => ({
    category: one(category, {
        fields: [product.category_id],
        references: [category.id]
    }),
    images: many(productImage),
    inventories: many(inventory),
    deliveryItems: many(deliveryItem)
}));

export const productImageRelations = relations(productImage, ({ one }) => ({
    product: one(product, {
        fields: [productImage.product_id],
        references: [product.id]
    })
}));

export const inventoryRelations = relations(inventory, ({ one, many }) => ({
    warehouse: one(warehouse, {
        fields: [inventory.warehouse_id],
        references: [warehouse.id]
    }),
    product: one(product, {
        fields: [inventory.product_id],
        references: [product.id]
    }),
    stockMovements: many(stockMovement)
}));

export const stockMovementRelations = relations(stockMovement, ({ one }) => ({
    inventory: one(inventory, {
        fields: [stockMovement.inventory_id],
        references: [inventory.id]
    }),
    user: one(user, {
        fields: [stockMovement.user_id],
        references: [user.id]
    })
}));

export const customerRelations = relations(customer, ({ many }) => ({
    deliveries: many(delivery)
}));

export const deliveryRelations = relations(delivery, ({ one, many }) => ({
    customer: one(customer, {
        fields: [delivery.customer_id],
        references: [customer.id]
    }),
    warehouse: one(warehouse, {
        fields: [delivery.warehouse_id],
        references: [warehouse.id]
    }),
    kurir: one(user, {
        fields: [delivery.kurir_id],
        references: [user.id]
    }),
    creator: one(user, {
        fields: [delivery.created_by],
        references: [user.id]
    }),
    items: many(deliveryItem),
    statusHistories: many(deliveryStatusHistory),
    media: many(deliveryMedia)
}));

export const deliveryItemRelations = relations(deliveryItem, ({ one }) => ({
    delivery: one(delivery, {
        fields: [deliveryItem.delivery_id],
        references: [delivery.id]
    }),
    product: one(product, {
        fields: [deliveryItem.product_id],
        references: [product.id]
    })
}));

export const deliveryStatusHistoryRelations = relations(deliveryStatusHistory, ({ one }) => ({
    delivery: one(delivery, {
        fields: [deliveryStatusHistory.delivery_id],
        references: [delivery.id]
    }),
    updatedBy: one(user, {
        fields: [deliveryStatusHistory.updated_by],
        references: [user.id]
    })
}));

export const deliveryMediaRelations = relations(deliveryMedia, ({ one }) => ({
    delivery: one(delivery, {
        fields: [deliveryMedia.delivery_id],
        references: [delivery.id]
    }),
    uploadedBy: one(user, {
        fields: [deliveryMedia.uploaded_by],
        references: [user.id]
    })
}));

export const deliveryReportRelations = relations(deliveryReport, ({ one }) => ({
    warehouse: one(warehouse, {
        fields: [deliveryReport.warehouse_id],
        references: [warehouse.id]
    })
}));

export const expeditionRelations = relations(expedition, ({ one, many }) => ({
    warehouse: one(warehouse, {
        fields: [expedition.warehouse_id],
        references: [warehouse.id]
    }),
    kurir: one(kurir, {
        fields: [expedition.kurir_id],
        references: [kurir.id]
    }),
    creator: one(user, {
        fields: [expedition.created_by],
        references: [user.id]
    }),
    items: many(expeditionItem)
}));

export const expeditionItemRelations = relations(expeditionItem, ({ one }) => ({
    expedition: one(expedition, {
        fields: [expeditionItem.expedition_id],
        references: [expedition.id]
    }),
    delivery: one(delivery, {
        fields: [expeditionItem.delivery_id],
        references: [delivery.id]
    })
}));

export const expeditionReportRelations = relations(expeditionReport, ({ one }) => ({
    warehouse: one(warehouse, {
        fields: [expeditionReport.warehouse_id],
        references: [warehouse.id]
    })
}));

export const kurirPerformanceRelations = relations(kurirPerformance, ({ one }) => ({
    kurir: one(kurir, {
        fields: [kurirPerformance.kurir_id],
        references: [kurir.id]
    })
}));
