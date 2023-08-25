import express from 'express';
import cors from 'cors';
import {success} from "../app/Helpers/functions";
export const api = express.Router();

api.use(cors());

api.get('/', (req: any, res) => {
    success(res, undefined, 'welcome to api.');
});