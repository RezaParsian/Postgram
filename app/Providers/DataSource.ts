import {Environment} from './Environment';
import "reflect-metadata";
import {DataSource} from "typeorm";
import {ColorConsole} from "../Utilities/Console";
import {Log} from "../../core/Log";

export class AppDataSource {
    protected static inst: AppDataSource;
    protected dataSource!: DataSource;

    protected constructor() {
        this.dataSource = new DataSource({
            type: "postgres",
            host: Environment.DATABASE_HOST,
            port: Environment.DATABASE_PORT,
            username: Environment.DATABASE_USER,
            password: Environment.DATABASE_PASSWORD,
            database: Environment.DATABASE_DB,
            synchronize: Environment.DATABASE_SYNCHRONIZE,
            logging: Environment.DATABASE_LOG,
            poolSize: Environment.POOL_SIZE,
            entities: ['app/Models/**/*.ts'],
            migrations: [],
            subscribers: [],
        });
    }

    public static instance() {
        if (!AppDataSource.inst)
            AppDataSource.inst = new AppDataSource();

        return AppDataSource.inst;
    }

    private async init() {
        await this.dataSource.initialize().then(() => {
            ColorConsole.info("Data Source has been initialized!");
        }).catch(reason => {
            Log().error(reason, 'Initialize AppDataSource');
        });
    }

    public async getDataSource(): Promise<DataSource> {
        if (!this.dataSource.isInitialized)
            await this.init();

        return this.dataSource;
    }

    public getConnection(): DataSource {
        if (!this.dataSource.isInitialized)
            throw new Error('initialize datasource first.');

        return this.dataSource;
    }
}