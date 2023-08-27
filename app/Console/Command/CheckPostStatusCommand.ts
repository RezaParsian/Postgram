import {Repository} from "typeorm";
import {Post} from "../../Models/Post";
import {AppDataSource} from "../../Providers/DataSource";
import {asyncForEach} from "../../Helpers/functions";
import {Consignment} from "../../../src/Post/PostTypes";
import {IranPost} from "../../../src/Post/IranPost";
import {ColorConsole} from "../../Utilities/Console";
import {PostLog} from "../../Models/PostLog";
import pub from "pug";
import {Environment} from "../../Providers/Environment";
import {Telegram} from "../../../src/Telegram";
import {User} from "../../Models/User";
import resourcePath = Environment.resourcePath;

const bot: Telegram = new Telegram();
let isRunning: boolean = false;

export async function checkPostStatusCommand() {
    if (isRunning)
        return;

    ColorConsole.info('checkPostStatusCommand');

    isRunning = true;

    let postRepository: Repository<Post> = AppDataSource.instance().getConnection().getRepository(Post);
    let postLogRepository: Repository<PostLog> = AppDataSource.instance().getConnection().getRepository(PostLog);
    let iranPost: IranPost = new IranPost();

    let posts = await postRepository.find({
        relations: ['postLogs', 'user']
    });

    await asyncForEach(posts, async (post: Post, index: number) => {
        let consignment: Consignment = await iranPost.collect(post.code!);
        let logChanged: boolean = false;

        await asyncForEach(consignment.post_logs, async (item: PostLog) => {
            let log: PostLog | undefined = post?.postLogs?.find((log: PostLog) => {
                return log.date === item.date && log.time === item.time;
            });

            if (log)
                return;

            await postLogRepository.save({
                date: item.date,
                description: item.description,
                time: item.time,
                location: item.location,
                post: post?.id
            });

            logChanged = true;
        });

        if (logChanged) {
            let message = pub.renderFile(resourcePath('View/changed.pug'), {
                code: post.code,
                sender: consignment.post_info.sender,
                log: consignment.post_logs[consignment.post_logs.length - 1]
            })

            if (consignment.post_logs.find(item => item.description?.includes('مرسوله جهت توزیع تحویل نامه رسان شده است'))) {
                postLogRepository.delete({
                    post: post.id
                }).catch(console.log).then(console.log);

                postRepository.delete({
                    id: post.id
                }).catch(console.log).then(console.log);
            }

            await bot.sendMessage((post.user as User).chat_id!, message);
        }

        return new Promise(resolve => setTimeout(resolve, 2_500));
    });

    isRunning = false;
}