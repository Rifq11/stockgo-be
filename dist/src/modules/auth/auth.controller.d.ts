import { Response } from 'express';
import { AuthRequest } from '../../middleware/auth.middleware';
export declare class AuthController {
    login(req: AuthRequest, res: Response): Promise<Response<any, Record<string, any>>>;
    register(req: AuthRequest, res: Response): Promise<Response<any, Record<string, any>>>;
    logout(req: AuthRequest, res: Response): Promise<Response<any, Record<string, any>>>;
    getProfile(req: AuthRequest, res: Response): Promise<Response<any, Record<string, any>>>;
    updateProfile(req: AuthRequest, res: Response): Promise<Response<any, Record<string, any>>>;
    changePassword(req: AuthRequest, res: Response): Promise<Response<any, Record<string, any>>>;
}
//# sourceMappingURL=auth.controller.d.ts.map