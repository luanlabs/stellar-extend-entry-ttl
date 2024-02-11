import { Contract, Keypair, SorobanRpc } from 'stellar-sdk';

import getFee from './getFee';

const getConfig = async () => {
  const contract = new Contract(String(process.env.CONTRACT_ID));
  const server = new SorobanRpc.Server(String(process.env.FUTURENET_RPC_URL));
  const adminSecretKey = Keypair.fromSecret(String(process.env.ADMIN_SECRET_KEY));
  const admin = await server.getAccount(adminSecretKey.publicKey());

  return {
    contract,
    server,
    admin,
    adminSecretKey,
    fee: getFee(),
  };
};
export default getConfig;
