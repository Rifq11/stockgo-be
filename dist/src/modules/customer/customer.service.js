"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CustomerService = void 0;
const db_1 = require("../../config/db");
const schema_1 = require("../../../drizzle/schema");
const drizzle_orm_1 = require("drizzle-orm");
class CustomerService {
    async createCustomer(data) {
        await db_1.db.insert(schema_1.customer).values({
            name: data.name,
            email: data.email,
            phone: data.phone,
            address: data.address,
            city: data.city,
            province: data.province,
            postal_code: data.postal_code,
            is_active: true,
        });
        const [newCustomer] = await db_1.db
            .select()
            .from(schema_1.customer)
            .where((0, drizzle_orm_1.eq)(schema_1.customer.email, data.email || ''))
            .limit(1);
        return newCustomer;
    }
    async getCustomers(page = 1, limit = 10) {
        const offset = (page - 1) * limit;
        const customers = await db_1.db
            .select()
            .from(schema_1.customer)
            .where((0, drizzle_orm_1.eq)(schema_1.customer.is_active, true))
            .limit(limit)
            .offset(offset)
            .orderBy((0, drizzle_orm_1.desc)(schema_1.customer.created_at));
        return customers;
    }
    async getCustomerById(id) {
        const [foundCustomer] = await db_1.db
            .select()
            .from(schema_1.customer)
            .where((0, drizzle_orm_1.eq)(schema_1.customer.id, id))
            .limit(1);
        return foundCustomer;
    }
}
exports.CustomerService = CustomerService;
//# sourceMappingURL=customer.service.js.map