import { checkIfEnvsAreSet } from 'inforce-env';

const checkEnvs = () => {
  const envs = [
    'ADMIN_SECRET_KEY',
    'FUTURENET_RPC_URL',
    'BASE_FEE',
    'CONTRACT_ID',
    'NODE_ENV',
    'LOG_FILE_PATH',
  ];
  checkIfEnvsAreSet(envs, true);
};

export default checkEnvs;
