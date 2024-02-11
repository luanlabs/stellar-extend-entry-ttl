import { Operation, xdr } from 'stellar-sdk';

import getConfig from '../getConfig';
import baseTransaction from '../baseTransaction';
import { MONTH_IN_LEDGERS } from '../../../constants/ledger';

const buildExtendTransaction = async (keys: xdr.LedgerKey[]): Promise<string> => {
  const { server, admin, adminSecretKey } = await getConfig();

  const call = Operation.extendFootprintTtl({ extendTo: MONTH_IN_LEDGERS * 6 });

  const transaction = await baseTransaction(admin, call, keys);

  const transactionPrepare = await server.prepareTransaction(transaction);

  transactionPrepare.sign(adminSecretKey);

  const response = await server.sendTransaction(transactionPrepare);
  return response.hash;
};

export default buildExtendTransaction;
