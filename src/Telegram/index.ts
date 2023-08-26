import {Environment} from "../../app/Providers/Environment";
import axios from "axios";
import {Log} from "../../core/Log";

export class Telegram {
    protected url: string = 'https://api.telegram.org/bot' + Environment.TELEGRAM.TOKEN;

    public async sendMessage(chatId: number, text: string) {
        return await axios.post(this.url + '/sendMessage', {
            chat_id: chatId,
            text,
            parse_mode: 'Markdown'
        }).catch(reason => {
            Log().error(reason);
        })
    }
}