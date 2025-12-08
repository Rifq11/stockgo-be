import 'dotenv/config';
import mysql from 'mysql2/promise';
import * as schema from '../../drizzle/schema';
export declare const db: import("drizzle-orm/mysql2").MySql2Database<typeof schema> & {
    $client: mysql.Pool;
};
//# sourceMappingURL=drizzle.d.ts.map