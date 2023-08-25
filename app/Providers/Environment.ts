import * as dotenv from "dotenv";
import path from "path";

dotenv.config();

export module Environment {
    export let PWD = process.env.PWD ?? '';

    export const SERVER = process.env.SERVER_IP ?? '127.0.0.1';

    export const EXPRESS_PORT = process.env.EXPRESS_PORT ?? 9090;

    export const DATABASE_HOST = process.env.DATABASE_HOST ?? 'localhost';

    export const DATABASE_TYPE = process.env.DATABASE_TYPE ?? 'postgres';

    export const DATABASE_PORT = Number(process.env.DATABASE_PORT) ?? 5432;

    export const DATABASE_SYNCHRONIZE = process.env.DATABASE_SYNCHRONIZE ? Boolean(Number(process.env.DATABASE_SYNCHRONIZE)) : false;

    export const DATABASE_LOG = process.env.DATABASE_LOG ? Boolean(Number(process.env.DATABASE_LOG)) : true;

    export const DATABASE_USER = process.env.DATABASE_USER ?? 'root';

    export const DATABASE_PASSWORD = process.env.DATABASE_PASSWORD ?? 'password';

    export const DATABASE_DB = process.env.DATABASE_DB ?? 'rp76';

    export const POOL_SIZE = Number(process.env.DATABASE_POOL_SIZE) ?? 10;

    export const TZ = process.env.TZ ?? 'UTC';

    export function storagePath(address: string = "") {
        return path.join(PWD, "storage", address);
    }
}