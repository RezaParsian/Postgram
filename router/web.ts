import express, {NextFunction, Request} from 'express';

export const web = express.Router();

web.get('/', (req: any, res: any) => {
    res.render('welcome');
});