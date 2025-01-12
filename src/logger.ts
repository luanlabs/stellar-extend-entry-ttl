import bunyan from 'bunyan';
import envs from './envs';

const { LOG_FILE_PATH, NODE_ENV } = envs();

let level = bunyan.TRACE;
let streams = [
  {
    level: bunyan.TRACE,
    stream: process.stdout,
  },
  {
    level: bunyan.WARN,
    path: LOG_FILE_PATH,
  },
];

if (NODE_ENV == 'production') {
  level = bunyan.WARN;
  streams = [
    {
      level: bunyan.WARN,
      path: LOG_FILE_PATH,
    },
  ];
}

export const log = bunyan.createLogger({
  name: 'stellar-extend-entry-ttl',
  src: true,
  level,
  streams,
});

export default log;
