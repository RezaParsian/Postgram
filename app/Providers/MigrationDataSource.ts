import {Environment} from './Environment';
import "reflect-metadata";
import {DataSource} from "typeorm";

export const migrationDataSource = new DataSource({
    type: "postgres",
    host: Environment.DATABASE_HOST,
    port: Environment.DATABASE_PORT,
    username: Environment.DATABASE_USER,
    password: Environment.DATABASE_PASSWORD,
    database: Environment.DATABASE_DB,
    synchronize: Environment.DATABASE_SYNCHRONIZE,
    logging: Environment.DATABASE_LOG,
    entities: ['app/Models/**/*.ts'],
    migrations: ['database/migrations/**/*.ts'],
    subscribers: [],
})