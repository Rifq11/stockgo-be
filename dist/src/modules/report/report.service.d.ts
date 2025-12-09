export declare class ReportService {
    getDeliveryReport(startDate?: string, endDate?: string, warehouseId?: number): Promise<{
        summary: {
            total_deliveries: number;
            successful_deliveries: number;
            in_progress_deliveries: number;
            failed_deliveries: number;
            success_rate: string;
            average_per_day: number;
        };
        period_data: any[];
    }>;
    getKurirReport(startDate?: string, endDate?: string, kurirId?: number): Promise<{
        kurirs: unknown[];
    }>;
    getProductReport(startDate?: string, endDate?: string, warehouseId?: number, categoryId?: number): Promise<{
        products: unknown[];
        summary: {
            total_products: number;
            total_quantity: number;
        };
    }>;
    getWarehouseReport(startDate?: string, endDate?: string, warehouseId?: number): Promise<{
        warehouses: any[];
    }>;
    private groupByPeriod;
    private groupByPeriodFromHistory;
    private getWeekStart;
    private formatWeek;
    private calculateAveragePerDay;
    private calculateAveragePerDayFromHistory;
}
//# sourceMappingURL=report.service.d.ts.map