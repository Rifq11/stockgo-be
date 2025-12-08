export declare class WarehouseService {
    getWarehouses(page?: number, limit?: number): Promise<{
        created_at: Date;
        updated_at: Date;
        id: number;
        name: string;
        code: string;
        type: "main" | "branch" | "distribution_center";
        address: string;
        city: string;
        province: string;
        postal_code: string | null;
        phone: string | null;
        email: string | null;
        manager_id: number | null;
        is_active: boolean;
    }[]>;
    getWarehouseById(id: number): Promise<{
        created_at: Date;
        updated_at: Date;
        id: number;
        name: string;
        code: string;
        type: "main" | "branch" | "distribution_center";
        address: string;
        city: string;
        province: string;
        postal_code: string | null;
        phone: string | null;
        email: string | null;
        manager_id: number | null;
        is_active: boolean;
    } | undefined>;
    createWarehouse(data: {
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
    }): Promise<{
        created_at: Date;
        updated_at: Date;
        id: number;
        name: string;
        code: string;
        type: "main" | "branch" | "distribution_center";
        address: string;
        city: string;
        province: string;
        postal_code: string | null;
        phone: string | null;
        email: string | null;
        manager_id: number | null;
        is_active: boolean;
    } | undefined>;
    updateWarehouse(id: number, data: any): Promise<{
        created_at: Date;
        updated_at: Date;
        id: number;
        name: string;
        code: string;
        type: "main" | "branch" | "distribution_center";
        address: string;
        city: string;
        province: string;
        postal_code: string | null;
        phone: string | null;
        email: string | null;
        manager_id: number | null;
        is_active: boolean;
    } | undefined>;
    deleteWarehouse(id: number): Promise<void>;
}
//# sourceMappingURL=warehouse.service.d.ts.map