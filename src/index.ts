import { log } from './logger';
import checkTTLData from './event/checkTTLData';

checkTTLData();

log.info({ message: 'App started' });
