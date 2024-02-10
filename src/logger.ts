import bunyan from 'bunyan';
import dotenv from 'dotenv';
import checkIfEnvsAreSet from './env';

dotenv.config();

checkIfEnvsAreSet();

let level = bunyan.TRACE;
let streams = [
  {
    level: bunyan.TRACE,
    stream: process.stdout,
  },
  {
    level: bunyan.WARN,
    path: process.env.LOG_FILE_PATH,
  },
];

if (process.env.NODE_ENV == 'production') {
  level = bunyan.WARN;
  streams = [
    {
      level: bunyan.WARN,
      path: process.env.LOG_FILE_PATH,
    },
  ];
}

export const log = bunyan.createLogger({
  name: 'fluxity-app',
  src: true,
  level,
  streams,
});

export default log;
