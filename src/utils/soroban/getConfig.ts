import { Contract, Keypair, SorobanRpc } from 'stellar-sdk';

const getConfig = async () => {
  const contract = new Contract(String(process.env.CONTRACT_ID));
  const server = new SorobanRpc.Server(String(process.env.FUTURENET_RPC_URL));
  const adminSecretKey = Keypair.fromSecret(String(process.env.ADMIN_SECRET_KEY));
  const admin = await server.getAccount(adminSecretKey.publicKey());
  const fee = String(process.env.BASE_FEE) || '1000000000';

  return {
    contract,
    server,
    admin,
    adminSecretKey,
    fee,
  };
};
export default getConfig;
