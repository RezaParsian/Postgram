import fs from "fs";
import pino from "pino";
import {Environment} from "../../app/Providers/Environment";
import path from "path";
import Logger = pino.Logger;

export function Log(filename?: string):Logger {
    const logPath: string = Environment.PWD + "/storage/logs";

    if (!filename)
        filename = new Date().toLocaleDateString('en-ZA').replace(/\//g, '-');

    const filePath = path.join(logPath, filename) + ".log";

    return pino({level: 'info'}, fs.createWriteStream(filePath));
}