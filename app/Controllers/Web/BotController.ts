import {Request, Response} from "express";
import {Message} from "../../../src/Telegram/TelegramTypes";
import {Telegram} from '../../../src/Telegram';
import {Post} from "../../Models/Post";
import {PostLog, PostLog as PostLogModel} from "../..//Models/PostLog";
import {IranPost} from "../../../src/Post/IranPost";
import {Consignment} from "../../../src/Post/PostTypes";
import * as pub from 'pug';
import {Environment} from "../../Providers/Environment";
import {Repository} from "typeorm";
import {AppDataSource} from "../../Providers/DataSource";
import {User} from "../../Models/User";
import {Log} from "../../../core/Log";

const bot = new Telegram();

export module BotController {

    import resourcePath = Environment.resourcePath;

    export async function index(req: Request, res: Response) {
        let pm: Message = req.body;

        switch (pm.message.text) {
            case '/start':
                user(pm).then(response => {
                    bot.sendMessage(pm.message.chat.id, response);
                });
                break;

            default:
                post(pm).then(response => {
                    bot.sendMessage(pm.message.chat.id,response);
                })
                break;
        }

        res.send({});
    }

    export async function user(pm: Message): Promise<string> {
        let userRepository: Repository<User> = AppDataSource.instance().getConnection().getRepository(User);
        let message: string = '🌹خوش آمدی.\n' +
            'همونطور که میدونی این ربات بهت کمک می‌کنه که مرسوله‌‌های پستی‌ات رو راحت تر پیگیری کنی و با هر تغییر وضعیت هم بهت خبر میده که مرسوله‌ات الان تو چه مرحله‌ای هست.\n' +
            '\n' +
            '⬅️ _هروقت خواستی مرسوله‌ی جدیدی اضافه کنی فقط کافیه کدرهگیری رو برام بفرستی تا فرایند شروع بشه._';

        userRepository.upsert({
            chat_id: pm.message.chat.id,
            firstName: pm.message.chat.first_name,
            lastName: pm.message.chat.last_name,
            from: pm.message.from.id,
            userName: pm.message.chat.username,
        }, ['from']).catch(reason => {
            Log().error(reason);
        })

        return message;
    }

    export async function post(pm: Message) {
        let userRepository: Repository<User> = AppDataSource.instance().getConnection().getRepository(User);
        let postRepository: Repository<Post> = AppDataSource.instance().getConnection().getRepository(Post);
        let postLogRepository: Repository<PostLogModel> = AppDataSource.instance().getConnection().getRepository(PostLogModel);
        let iranPost: IranPost = new IranPost();
        let code: string = pm.message.text;
        let consignment: Consignment = await iranPost.collect(code);

        if (!consignment?.post_info?.from)
            return '💀 کد مرسوله‌ای که ارسال کردی خرابه.';

        if (consignment.post_logs.find(item => item.description?.includes('مرسوله جهت توزیع تحویل نامه رسان شده است')))
            return pub.renderFile(resourcePath('View/finished.pug'), {
                postman: consignment.postman
            });

        let user = await userRepository.findOneBy({
            from: pm.message.from.id
        }).catch(reason => {
            Log().error(reason);
        });

        if (!user)
            return 'کاربری شما ساخته نشده است\n لطفا ابتدا با کمک دستور /start ثبت‌نام فرمایید';

        postRepository.findOne({
            where: {
                code: code
            },
            relations: ['postLogs']
        }).then(async (res: Post | null) => {
            if (!res)
                res = await postRepository.save({
                    user: user?.id,
                    code: code,
                    data: consignment.post_info,
                });

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
        });

        return pub.renderFile(resourcePath('View/post.pug'), consignment.post_info);
    }
}