import { Response } from 'express';
import { AuthRequest } from '../../middleware/auth.middleware';
export declare class CustomerController {
    createCustomer(req: AuthRequest, res: Response): Promise<Response<any, Record<string, any>>>;
    getCustomers(req: AuthRequest, res: Response): Promise<Response<any, Record<string, any>>>;
    getCustomerById(req: AuthRequest, res: Response): Promise<Response<any, Record<string, any>>>;
    updateCustomer(req: AuthRequest, res: Response): Promise<Response<any, Record<string, any>>>;
    deleteCustomer(req: AuthRequest, res: Response): Promise<Response<any, Record<string, any>>>;
}
//# sourceMappingURL=customer.controller.d.ts.map