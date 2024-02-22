import { Operation, xdr } from 'stellar-sdk';

import getConfig from '../getConfig';
import baseTransaction from '../baseTransaction';

const buildRestoreTransaction = async (keys: xdr.LedgerKey[]): Promise<string> => {
  const { server, admin, adminSecretKey } = await getConfig();

  const call = Operation.restoreFootprint({});

  const transaction = await baseTransaction(admin, call, keys, 'restore');

  const transactionPrepare = await server.prepareTransaction(transaction);

  transactionPrepare.sign(adminSecretKey);

  const response = await server.sendTransaction(transactionPrepare);
  return response.hash;
};

export default buildRestoreTransaction;
