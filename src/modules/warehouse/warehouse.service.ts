import { db } from '../../config/db';
import { warehouse } from '../../../drizzle/schema';
import { eq } from 'drizzle-orm';

export class WarehouseService {
  async getWarehouses(page: number = 1, limit: number = 10) {
    const offset = (page - 1) * limit;

    const warehouses = await db
      .select()
      .from(warehouse)
      .where(eq(warehouse.is_active, true))
      .limit(limit)
      .offset(offset);

    return warehouses;
  }

  async getWarehouseById(id: number) {
    const [foundWarehouse] = await db
      .select()
      .from(warehouse)
      .where(eq(warehouse.id, id))
      .limit(1);

    return foundWarehouse;
  }

  async createWarehouse(data: {
    name: string;
    code: string;
    type: string;
    address: string;
    city: string;
    province: string;
    postal_code?: string;
    phone?: string;
    email?: string;
    manager_id?: number;
  }) {
    await db.insert(warehouse).values({
      name: data.name,
      code: data.code,
      type: data.type as any,
      address: data.address,
      city: data.city,
      province: data.province,
      postal_code: data.postal_code,
      phone: data.phone,
      email: data.email,
      manager_id: data.manager_id,
      is_active: true,
    });

    const [created] = await db
      .select()
      .from(warehouse)
      .where(eq(warehouse.code, data.code))
      .limit(1);

    return created;
  }

  async updateWarehouse(id: number, data: any) {
    await db
      .update(warehouse)
      .set(data)
      .where(eq(warehouse.id, id));

    return this.getWarehouseById(id);
  }

  async deleteWarehouse(id: number) {
    await db
      .update(warehouse)
      .set({ is_active: false })
      .where(eq(warehouse.id, id));
  }
}

