import {AppDataSource} from './app/Providers/DataSource';
import * as server from './app/Providers/Server';
import {schedule} from "./app/Console/Kernel";
import {checkPostStatusCommand} from "./app/Console/Command/CheckPostStatusCommand";

async function bootstrap() {
    // Initialize Database in boostrap.
    await AppDataSource.instance().getDataSource();

    // Run Webserver.
    server.serve();

    // Run all schedule and listen to them.
    await schedule();
}

bootstrap().then(async () => {
    await checkPostStatusCommand();
});