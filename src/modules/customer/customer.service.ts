import { db } from '../../config/db';
import { customer } from '../../../drizzle/schema';
import { eq, desc } from 'drizzle-orm';

export class CustomerService {
  async createCustomer(data: {
    name: string;
    email?: string;
    phone?: string;
    address: string;
    city: string;
    province: string;
    postal_code?: string;
  }) {
    await db.insert(customer).values({
      name: data.name,
      email: data.email,
      phone: data.phone,
      address: data.address,
      city: data.city,
      province: data.province,
      postal_code: data.postal_code,
      is_active: true,
    });

    const [newCustomer] = await db
      .select()
      .from(customer)
      .where(eq(customer.email, data.email || ''))
      .limit(1);

    return newCustomer;
  }

  async getCustomers(page: number = 1, limit: number = 10) {
    const offset = (page - 1) * limit;

    const customers = await db
      .select()
      .from(customer)
      .where(eq(customer.is_active, true))
      .limit(limit)
      .offset(offset)
      .orderBy(desc(customer.created_at));

    return customers;
  }

  async getCustomerById(id: number) {
    const [foundCustomer] = await db
      .select()
      .from(customer)
      .where(eq(customer.id, id))
      .limit(1);

    return foundCustomer;
  }
}

