import { checkIfEnvsAreSet } from 'env-exist';

const checkEnvs = () => {
  const envs = [
    'ADMIN_SECRET_KEY',
    'FUTURENET_RPC_URL',
    'BASE_FEE',
    'CONTRACT_ID',
    'NODE_ENV',
    'LOG_FILE_PATH',
  ];
  if (!checkIfEnvsAreSet(envs, process)) {
    process.exit(1);
  }
};

export default checkEnvs;
