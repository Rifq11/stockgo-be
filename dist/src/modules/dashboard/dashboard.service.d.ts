export declare class DashboardService {
    getDashboardStats(warehouseId?: number, startDate?: string, endDate?: string): Promise<{
        total_deliveries: number;
        status_distribution: {
            status: "pending" | "picked_up" | "in_transit" | "delivered" | "failed" | "cancelled";
            count: number;
        }[];
        recent_deliveries: {
            created_at: Date;
            updated_at: Date;
            id: number;
            tracking_number: string;
            customer_id: number;
            warehouse_id: number;
            kurir_id: number | null;
            status: "pending" | "picked_up" | "in_transit" | "delivered" | "failed" | "cancelled";
            pickup_address: string;
            delivery_address: string;
            delivery_city: string;
            delivery_province: string;
            delivery_postal_code: string | null;
            notes: string | null;
            total_weight: string | null;
            total_value: string | null;
            shipping_cost: string | null;
            scheduled_pickup: Date | null;
            scheduled_delivery: Date | null;
            picked_up_at: Date | null;
            delivered_at: Date | null;
            created_by: number;
        }[];
    }>;
    getDeliveryAnalytics(warehouseId?: number, startDate?: string, endDate?: string): Promise<{
        daily_stats: {
            date: string;
            count: number;
        }[];
    }>;
    getKurirPerformance(startDate?: string, endDate?: string): Promise<{
        kurir_stats: {
            kurir_id: number | null;
            total_deliveries: number;
            completed_deliveries: number;
        }[];
    }>;
    getWarehouseStats(): Promise<{
        warehouses: {
            warehouse: {
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
            };
            total_deliveries: number;
        }[];
    }>;
}
//# sourceMappingURL=dashboard.service.d.ts.map