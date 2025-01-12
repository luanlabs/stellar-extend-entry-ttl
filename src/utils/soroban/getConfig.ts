import { Contract, Keypair, rpc } from '@stellar/stellar-sdk';

import envs from '../../envs';

const getConfig = async () => {
  const { CONTRACT_ID, RPC_URL, ADMIN_SECRET_KEY, BASE_FEE } = envs();

  const contract = new Contract(CONTRACT_ID);
  const server = new rpc.Server(RPC_URL);
  const adminSecretKey = Keypair.fromSecret(ADMIN_SECRET_KEY);
  const admin = await server.getAccount(adminSecretKey.publicKey());
  const fee = BASE_FEE || '1000000000';

  return {
    contract,
    server,
    admin,
    adminSecretKey,
    fee,
  };
};
export default getConfig;
