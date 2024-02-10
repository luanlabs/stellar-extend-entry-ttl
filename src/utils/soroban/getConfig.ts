import { Contract, SorobanRpc } from 'stellar-sdk';

import getAdmin from './getAdmin';
import { Network } from '../../types/networkType';

const getConfig = async (network: Network) => {
  let contract = new Contract(String(process.env.MAINNET_CONTRACT_ID));
  let server = new SorobanRpc.Server(String(process.env.MAINNET_FUTURENET_RPC_URL));
  let admin = await server.getAccount(getAdmin().publicKey());

  if (network === 'testnet') {
    contract = new Contract(String(process.env.TESTNET_CONTRACT_ID));
    server = new SorobanRpc.Server(String(process.env.TESTNET_FUTURENET_RPC_URL));
    admin = await server.getAccount(getAdmin().publicKey());
  }

  return {
    contract,
    server,
    admin,
  };
};
export default getConfig;
