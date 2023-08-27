import cron from 'node-cron';
import {ColorConsole} from "../Utilities/Console";
import {checkPostStatusCommand} from "./Command/CheckPostStatusCommand";

function everySecond(task: () => void): cron.ScheduledTask {
    return cron.schedule('* * * * * *', task);
}

function everyMinute(task: () => void): cron.ScheduledTask {
    return cron.schedule('* * * * *', task);
}

function everyHour(task: () => void): cron.ScheduledTask {
    return cron.schedule('0 * * * *', task);
}

export async function schedule() {
    everyMinute(checkPostStatusCommand);

    ColorConsole.info('Schedule Are Planned!');
}