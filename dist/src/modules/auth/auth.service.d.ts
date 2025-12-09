export declare class AuthService {
    login(email: string, password: string): Promise<{
        id: number;
        email: string;
        full_name: string;
        role_id: number;
        role: string;
        is_active: true;
        token: string;
    }>;
    register(data: {
        full_name: string;
        email: string;
        password: string;
        phone?: string;
        role_id?: number;
    }): Promise<{
        id: number;
        email: string;
        full_name: string;
        role_id: number;
        is_active: boolean;
        token: string;
    }>;
    getProfile(userId: number): Promise<{
        id: number;
        full_name: string;
        email: string;
        phone: string | null;
        role_id: number;
        role: {
            id: number;
            name: string;
            description: string | null;
        };
        is_active: boolean;
        created_at: Date;
    }>;
    updateProfile(userId: number, payload: {
        full_name: string;
        email: string;
        phone?: string;
    }): Promise<{
        id: number;
        full_name: string;
        email: string;
        phone: string | null;
        role_id: number;
        role: {
            id: number;
            name: string;
            description: string | null;
        };
        is_active: boolean;
        created_at: Date;
    }>;
    changePassword(userId: number, oldPassword: string, newPassword: string): Promise<{
        success: boolean;
        message: string;
    }>;
}
//# sourceMappingURL=auth.service.d.ts.map