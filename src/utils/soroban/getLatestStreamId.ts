import { scValToNative } from 'stellar-sdk';
import getConfig from './getConfig';
import baseTransaction from './baseTransaction';
import { Network } from '../../types/networkType';
import getAdmin from './getAdmin';

export const getLatestStreamId = async (network: Network): Promise<string> => {
  const { server, contract } = await getConfig(network);
  const admin = await server.getAccount(getAdmin().publicKey());

  const call = contract.call('get_latest_stream_id');

  const transactionResult = await baseTransaction(admin, call);

  const transactionSimulate = await server.simulateTransaction(transactionResult);

  const retval: string = scValToNative(Object(transactionSimulate).result.retval);

  return retval;
};

export default getLatestStreamId;
