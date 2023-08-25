import express from 'express';
import * as bodyParser from 'body-parser';
import {api} from "../../router/api";
import {Environment} from "./Environment";
import {web} from "../../router/web";
import session from "express-session";
import flash from "connect-flash";
import {ColorConsole} from "../Utilities/Console";

export const route: express.Application = express();
const port: number = Environment.EXPRESS_PORT as number;

route.use(bodyParser.urlencoded({extended: true, limit: '50mb'}));

route.use(bodyParser.json({limit: '50mb'}));

route.use(flash());

route.use(session({
    secret: 'my-secret-key',
    saveUninitialized: true,
    resave: false
}));

route.use(express.static('public'));

route.set('views', Environment.PWD + '/resource/View');
route.set('view engine', 'pug');

route.use('/api', api);
route.use('/', web);

export const serve = () => {
    route.listen(port, () => {
        ColorConsole.primary(`Starting Express server: http://127.0.0.1:${port}`)
    });
}