import {AppDataSource} from './app/Providers/DataSource';
import * as server from './app/Providers/Server';
import {schedule} from "./app/Console/Kernel";
import {Repository} from "typeorm";
import {PostLog} from "./app/Models/PostLog";

async function bootstrap() {
    // Initialize Database in boostrap.
    await AppDataSource.instance().getDataSource();

    // Run Webserver.
    server.serve();

    // Run all schedule and listen to them.
    await schedule();
}

bootstrap().then(async () => {
    // let postLogRepository: Repository<PostLog> = AppDataSource.instance().getConnection().getRepository(PostLog);
    //
    // postLogRepository.delete({
    //     post: 1
    // }).then(console.log)
});