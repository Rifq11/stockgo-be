export declare class KurirService {
    getKurirs(page?: number, limit?: number): Promise<{
        user: {
            created_at: Date;
            updated_at: Date;
            id: number;
            full_name: string;
            email: string;
            password: string;
            phone: string | null;
            role_id: number;
            is_active: boolean;
        };
        created_at: Date;
        updated_at: Date;
        id: number;
        user_id: number;
        employee_id: string;
        license_number: string | null;
        vehicle_type: string | null;
        vehicle_plate: string | null;
        status: "available" | "busy" | "offline" | "on_break";
        current_location: string | null;
        max_capacity: string | null;
        rating: string | null;
        total_deliveries: number | null;
    }[]>;
    getKurirById(id: number): Promise<{
        user: {
            created_at: Date;
            updated_at: Date;
            id: number;
            full_name: string;
            email: string;
            password: string;
            phone: string | null;
            role_id: number;
            is_active: boolean;
        };
        created_at: Date;
        updated_at: Date;
        id: number;
        user_id: number;
        employee_id: string;
        license_number: string | null;
        vehicle_type: string | null;
        vehicle_plate: string | null;
        status: "available" | "busy" | "offline" | "on_break";
        current_location: string | null;
        max_capacity: string | null;
        rating: string | null;
        total_deliveries: number | null;
    } | null>;
    updateKurirStatus(id: number, status: string, location?: string): Promise<{
        user: {
            created_at: Date;
            updated_at: Date;
            id: number;
            full_name: string;
            email: string;
            password: string;
            phone: string | null;
            role_id: number;
            is_active: boolean;
        };
        created_at: Date;
        updated_at: Date;
        id: number;
        user_id: number;
        employee_id: string;
        license_number: string | null;
        vehicle_type: string | null;
        vehicle_plate: string | null;
        status: "available" | "busy" | "offline" | "on_break";
        current_location: string | null;
        max_capacity: string | null;
        rating: string | null;
        total_deliveries: number | null;
    } | null>;
    getKurirPerformance(id: number, startDate?: string, endDate?: string): Promise<{
        kurir: {
            user: {
                created_at: Date;
                updated_at: Date;
                id: number;
                full_name: string;
                email: string;
                password: string;
                phone: string | null;
                role_id: number;
                is_active: boolean;
            };
            created_at: Date;
            updated_at: Date;
            id: number;
            user_id: number;
            employee_id: string;
            license_number: string | null;
            vehicle_type: string | null;
            vehicle_plate: string | null;
            status: "available" | "busy" | "offline" | "on_break";
            current_location: string | null;
            max_capacity: string | null;
            rating: string | null;
            total_deliveries: number | null;
        };
        performance: {
            total_deliveries: number;
            completed_deliveries: number;
            rating: string | null;
            status: "available" | "busy" | "offline" | "on_break";
        };
    } | null>;
    updateKurirRating(id: number, rating: number): Promise<{
        user: {
            created_at: Date;
            updated_at: Date;
            id: number;
            full_name: string;
            email: string;
            password: string;
            phone: string | null;
            role_id: number;
            is_active: boolean;
        };
        created_at: Date;
        updated_at: Date;
        id: number;
        user_id: number;
        employee_id: string;
        license_number: string | null;
        vehicle_type: string | null;
        vehicle_plate: string | null;
        status: "available" | "busy" | "offline" | "on_break";
        current_location: string | null;
        max_capacity: string | null;
        rating: string | null;
        total_deliveries: number | null;
    } | null>;
    getKurirByUserId(userId: number): Promise<{
        user: {
            created_at: Date;
            updated_at: Date;
            id: number;
            full_name: string;
            email: string;
            password: string;
            phone: string | null;
            role_id: number;
            is_active: boolean;
        };
        created_at: Date;
        updated_at: Date;
        id: number;
        user_id: number;
        employee_id: string;
        license_number: string | null;
        vehicle_type: string | null;
        vehicle_plate: string | null;
        status: "available" | "busy" | "offline" | "on_break";
        current_location: string | null;
        max_capacity: string | null;
        rating: string | null;
        total_deliveries: number | null;
    } | null>;
    createKurir(userId: number, data: {
        license_number?: string;
        vehicle_type?: string;
        vehicle_plate?: string;
        current_location?: string;
        max_capacity?: string;
    }): Promise<{
        user: {
            created_at: Date;
            updated_at: Date;
            id: number;
            full_name: string;
            email: string;
            password: string;
            phone: string | null;
            role_id: number;
            is_active: boolean;
        };
        created_at: Date;
        updated_at: Date;
        id: number;
        user_id: number;
        employee_id: string;
        license_number: string | null;
        vehicle_type: string | null;
        vehicle_plate: string | null;
        status: "available" | "busy" | "offline" | "on_break";
        current_location: string | null;
        max_capacity: string | null;
        rating: string | null;
        total_deliveries: number | null;
    } | null>;
    updateKurir(id: number, data: {
        license_number?: string;
        vehicle_type?: string;
        vehicle_plate?: string;
        current_location?: string;
        max_capacity?: string;
    }): Promise<{
        user: {
            created_at: Date;
            updated_at: Date;
            id: number;
            full_name: string;
            email: string;
            password: string;
            phone: string | null;
            role_id: number;
            is_active: boolean;
        };
        created_at: Date;
        updated_at: Date;
        id: number;
        user_id: number;
        employee_id: string;
        license_number: string | null;
        vehicle_type: string | null;
        vehicle_plate: string | null;
        status: "available" | "busy" | "offline" | "on_break";
        current_location: string | null;
        max_capacity: string | null;
        rating: string | null;
        total_deliveries: number | null;
    } | null>;
    deleteKurir(id: number): Promise<{
        success: boolean;
    } | null>;
    getAvailableUsers(): Promise<{
        created_at: Date;
        updated_at: Date;
        id: number;
        full_name: string;
        email: string;
        password: string;
        phone: string | null;
        role_id: number;
        is_active: boolean;
    }[]>;
}
//# sourceMappingURL=kurir.service.d.ts.map