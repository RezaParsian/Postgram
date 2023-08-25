import {AppDataSource} from './app/Providers/DataSource';
import * as server from './app/Providers/Server';
import {schedule} from "./app/Console/Kernel";
import {Post} from "./app/Models/Post";
import {PostLog as PostLogModel} from "./app/Models/PostLog";
import {IranPost} from "./src/Post/IranPost";
import {Consignment, PostLog} from "./src/Post/PostTypes";
import {Repository} from "typeorm";

async function bootstrap() {
    // Initialize Database in boostrap.
    await AppDataSource.instance().getDataSource();

    // Run Webserver.
    server.serve();

    // Run all schedule and listen to them.
    await schedule();
}

bootstrap().then(async () => {
    let postRepository: Repository<Post> = AppDataSource.instance().getConnection().getRepository(Post);
    let postLogRepository: Repository<PostLogModel> = AppDataSource.instance().getConnection().getRepository(PostLogModel);
    let code: string = '154880215600066810084114';
    let iranPost: IranPost = new IranPost();

    let consignment: Consignment = await iranPost.collect(code);

    postRepository.findOne({
        where: {
            code: code
        },
        relations: ['postLogs']
    }).then(async (res: Post | null) => {
        if (!res)
            res = await postRepository.save({
                user: 1,
                code: code,
                data: consignment.post_info,
            })

        consignment.post_logs.forEach((item: PostLog) => {
            let log: PostLogModel | undefined = res?.postLogs?.find((log: PostLogModel) => {
                return log.date === item.date && log.time === item.time;
            });

            if (log)
                return;

            postLogRepository.save({
                date: item.date,
                description: item.description,
                time: item.time,
                location: item.location,
                post: res?.id
            })
        })
    })
});