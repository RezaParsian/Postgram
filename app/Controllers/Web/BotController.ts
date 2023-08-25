import {Request, Response} from "express";
import {Message} from "../../../src/Telegram/TelegramTypes";
import {Telegram} from '../../../src/Telegram';
import {Post} from "../../Models/Post";
import {PostLog, PostLog as PostLogModel} from "../..//Models/PostLog";
import {IranPost} from "../../../src/Post/IranPost";
import {Consignment} from "../../../src/Post/PostTypes";
import {Repository} from "typeorm";
import {AppDataSource} from "../../Providers/DataSource";

const bot = new Telegram();

export module BotController {

    export async function index(req: Request, res: Response) {
        let pm: Message = req.body;

        switch (pm.message.text) {
            case '/start':
                bot.sendMessage(pm.message.chat.id, '🌹خوش آمدی.\n' +
                    'همونطور که میدونی این ربات بهت کمک می‌کنه که مرسوله‌‌های پستی‌ات رو راحت تر پیگیری کنی و با هر تغییر وضعیت هم بهت خبر میده که مرسوله‌ات الان تو چه مرحله‌ای هست.\n' +
                    '\n' +
                    '⬅️ _هروقت خواستی مرسوله‌ی جدیدی اضافه کنی فقط کافیه کدرهگیری رو برام بفرستی تا فرایند شروع بشه._');
                break;

            default:
                post(pm.message.text).then(res=>{
                    console.log(res);
                    bot.sendMessage(pm.message.chat.id,res);
                })
                break;
        }

        res.send({});
    }

    export async function post(code: string) {
        let postRepository: Repository<Post> = AppDataSource.instance().getConnection().getRepository(Post);
        let postLogRepository: Repository<PostLogModel> = AppDataSource.instance().getConnection().getRepository(PostLogModel);
        let iranPost: IranPost = new IranPost();

        let consignment: Consignment = await iranPost.collect(code);

        if (!consignment.post_info)
            return 'کد مرسوله‌ای که ارسال کردی خرابه.';

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
        });

        return 'salam';
    }
}