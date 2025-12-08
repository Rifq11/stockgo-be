export declare class CustomerService {
    createCustomer(data: {
        name: string;
        email?: string;
        phone?: string;
        address: string;
        city: string;
        province: string;
        postal_code?: string;
    }): Promise<{
        created_at: Date;
        updated_at: Date;
        id: number;
        name: string;
        email: string | null;
        phone: string | null;
        address: string;
        city: string;
        province: string;
        postal_code: string | null;
        is_active: boolean;
    } | undefined>;
    getCustomers(page?: number, limit?: number): Promise<{
        created_at: Date;
        updated_at: Date;
        id: number;
        name: string;
        email: string | null;
        phone: string | null;
        address: string;
        city: string;
        province: string;
        postal_code: string | null;
        is_active: boolean;
    }[]>;
    getCustomerById(id: number): Promise<{
        created_at: Date;
        updated_at: Date;
        id: number;
        name: string;
        email: string | null;
        phone: string | null;
        address: string;
        city: string;
        province: string;
        postal_code: string | null;
        is_active: boolean;
    } | undefined>;
}
//# sourceMappingURL=customer.service.d.ts.map