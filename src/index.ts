import dotenv from 'dotenv';

import { log } from './logger';
import checkTTLData from './event/checkTTLData';

dotenv.config();

checkTTLData();

log.info({ message: 'App started' });
