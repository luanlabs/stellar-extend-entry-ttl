import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import express from 'express';
import bodyParser from 'body-parser';
import compression from 'compression';

import { log } from './logger';
import checkTTLData from './event/checkTTLData';

dotenv.config();

const app = express();

const { PORT: port } = process.env;

app.use(compression());
app.use(helmet());
app.disable('x-powered-by');

checkTTLData('testnet');

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.listen(port, () => {
  log.info({ message: 'App started' });
});
