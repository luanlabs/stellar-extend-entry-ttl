import { scValToBigInt } from 'stellar-sdk';

import getConfig from './getConfig';
import baseTransaction from './baseTransaction';

export const getLatestStreamId = async (): Promise<bigint> => {
  const { server, contract, admin } = await getConfig();

  const call = contract.call('get_latest_lockup_id');

  const transactionResult = await baseTransaction(admin, call);

  const transactionSimulate = await server.simulateTransaction(transactionResult);

  const retval = scValToBigInt(Object(transactionSimulate).result.retval);

  return retval;
};

export default getLatestStreamId;
