import {Response} from "express";

export function success(res: Response, data?: object, message: string = 'request executed successfully.', status: number = 200): void {
    res.status(status);

    res.send({
        status: true,
        message,
        data
    });
}

export function danger(res: Response, data?: object, message: string = 'something bad happened.', status: number = 500): void {
    res.status(status);

    res.send({
        status: false,
        message,
        data
    });
}

export async function asyncForEach(array: any[], fn: (item: any, index: number) => any) {
    const startTime = process.hrtime();

    for (const [index, item] of Object.entries(array))
        await fn(item, Number(index));

    const endTime = process.hrtime(startTime);

    return `${array.length} process finished in ${endTime[0]}s`;
}
