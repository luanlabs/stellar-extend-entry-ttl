const checkIfEnvsAreSet = () => {
  const envs = [
    'PORT',
    'ADMIN_SECRET_KEY',
    'TESTNET_FUTURENET_RPC_URL',
    'MAINNET_FUTURENET_RPC_URL',
    'BASE_FEE',
    'TESTNET_CONTRACT_ID',
    'MAINNET_CONTRACT_ID',
    'NODE_ENV',
    'LOG_FILE_PATH',
  ];

  let status = false;

  for (let i = 0; i < envs.length; i++) {
    if (!process.env[envs[i]]) {
      console.log(envs[i] + ' is not defined');
      status = true;
    }
  }

  if (status) {
    process.exit(1);
  }
};

export default checkIfEnvsAreSet;
