export interface TokenPayload {
    id: number;
    email: string;
    role_id: number;
    role?: string;
    is_active: boolean;
}
export declare const generateToken: (payload: TokenPayload) => string;
export declare const verifyToken: (token: string) => TokenPayload;
//# sourceMappingURL=jwt.util.d.ts.map