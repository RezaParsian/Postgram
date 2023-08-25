import express, {NextFunction, Request} from 'express';
import {BotController} from "../app/Controllers/Web/BotController";
export const web = express.Router();

web.get('/', (req: any, res: any) => {
    res.render('welcome');
});

web.all('/bot',BotController.index)