import axios from "axios";
import * as cheerio from 'cheerio';
import {Consignment, PostInfo, PostLog} from "./PostTypes";

export class IranPost {
    protected api: string = 'READ FROM ENV';

    public async collect(search: string): Promise<Consignment> {
        let data: string = await this.search(search);
        let consignment: Consignment = {} as Consignment;

        if (!data)
            return consignment;

        consignment = {
            post_info: await this.collectPostData(data),
            post_logs: await this.postLogs(data),
            postman: await this.postman(data)
        };


        return consignment;
    }

    protected async search(search: string): Promise<string> {
        return await axios.get(this.api + search, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/115.0.5790.171 Safari/537.36',
                'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
                'Referer': 'https://tracking.post.ir/'
            }
        })
            .then((res) => res.data)
            .catch(() => {
            })
    }

    protected async collectPostData(data: string) {
        let postInfo: PostInfo = {} as PostInfo;

        let $ = cheerio.load(data);

        if ($('.alert.alert-danger').length > 0)
            return postInfo;

        postInfo = {
            content: $('div:contains(محتویات مرسوله)').eq(-2).text().split(': ')[1]?.trim(),
            accepted_at: $('div:contains(تاریخ و ساعت قبول)').eq(-1).text().split(': ')[1]?.trim(),
            price: {
                p1: $('div:contains("کرايه پستي :")').eq(-2).text().split(":")[1]?.trim(),
                p2: $('div:contains("کرايه پستي پس از تخفيف :")').eq(-2).text().split(":")[1]?.trim(),
                p3: $('div:contains("تعهد غرامت اجباري :")').eq(-2).text().split(":")[1]?.trim(),
                p4: $('div:contains("آگهي تحويل الکترونيک :")').eq(-2).text().split(":")[1]?.trim(),
                p5: $('div:contains("سرويس پيام کوتاه :")').eq(-2).text().split(":")[1]?.trim(),
                p6: $('div:contains("ماليات بر ارزش افزوده :")').eq(-2).text().split(":")[1]?.trim(),
                p7: $('div:contains("حق السهم پست :")').eq(-2).text().split(":")[1]?.trim(),
                p8: $('div:contains("هزينه پستي (با ماليات) :")').eq(-2).text().split(":")[1]?.trim(),
            }
        }

        let data1: string[] | undefined = $('div:contains(نوع سرویس)').eq(-2)?.html()?.split('">');

        if (data1) {
            postInfo.type = data1[data1.findIndex(item => item.includes('نوع سرویس')) + 1].split('</')[0]
            postInfo.office = data1[data1.findIndex(item => item.includes('دفتر پستی مبداء')) + 1].split('</')[0]
        }

        data1 = $('div:contains("مبدا:")').eq(-2)?.html()?.split('">');

        if (data1) {
            postInfo.from = data1[data1.findIndex(item => item.includes('مبدا')) + 1].split('</')[0]
            postInfo.to = data1[data1.findIndex(item => item.includes('مقصد')) + 1].split('</')[0]
        }

        data1 = $('div:contains("فرستنده")').eq(-2)?.html()?.split('">');

        if (data1) {
            postInfo.sender = data1[data1.findIndex(item => item.includes('نام فرستنده')) + 1].split('</')[0]
            postInfo.receiver = data1[data1.findIndex(item => item.includes('نام گیرنده')) + 1].split('</')[0]
        }

        data1 = $('div:contains(وزن)').eq(-2)?.html()?.split('">');

        if (data1) {
            postInfo.weight = Number(data1[data1.findIndex(item => item.includes('وزن')) + 1].split('</')[0])
            postInfo.totalPrice = data1[data1.findIndex(item => item.includes('هزینه پستی')) + 1].split('</')[0]
        }

        return postInfo;
    }

    protected async postLogs(data: string): Promise<PostLog[]> {
        let logs: PostLog[] = [];
        let row: { date?: string; location?: string; time?: string } = {};

        let $ = cheerio.load(data);

        if ($('.alert.alert-danger').length > 0)
            return logs;

        $('#pnlResult').find('div').find('div.row').splice(1).forEach(item => {
            let element = $(item);

            if (element.attr('class') === 'row') {
                let divs = $(element).find('div');

                row = {
                    date: $(divs[0]).text(),
                    location: $(divs[1]).text(),
                    time: $(divs[2]).text(),
                }
            } else {
                let divs = $(element).find('div');

                logs.push({
                    date: row.date,
                    description: $(divs[1]).text().replace('(مشاهده جزئیات بیشتر)', '').replace('(مشاهده اطلاعات نامه رسان)', '').trim(),
                    location: $(divs[2]).text().trim(),
                    time: $(divs[3]).text().trim(),
                })
            }
        })

        return logs.reverse();
    }

    protected async postman(data: string): Promise<string> {
        let $ = cheerio.load(data);

        if ($('.alert.alert-danger').length > 0)
            return '';

        return $(".text-center.col-lg-4.col-md-4.col-sm-6.col-xs-12.col-lg-offset-4.col-md-offset-4.col-sm-offset-3").eq(0).text();
    }
}