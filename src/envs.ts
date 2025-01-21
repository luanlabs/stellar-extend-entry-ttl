import envEnforcer from 'envil';

const envs = () => {
  const envs = [
    'ADMIN_SECRET_KEY',
    'RPC_URL',
    'BASE_FEE',
    'CONTRACT_ID',
    'NODE_ENV',
    'LOG_FILE_PATH',
    'API_URL',
  ];

  return envEnforcer(envs, { returnValues: true });
};

export default envs;
