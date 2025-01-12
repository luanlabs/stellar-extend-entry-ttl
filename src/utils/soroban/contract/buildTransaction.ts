import { Operation, xdr } from '@stellar/stellar-sdk';

import getConfig from '../getConfig';
import baseTransaction from '../baseTransaction';
import { MONTH_IN_LEDGERS } from '../../../constants/ledgerTime';
import { TTransaction, Transactions } from '../../../types/Transactions';

const buildTransaction = async (
  keys: xdr.LedgerKey[],
  transactionType: TTransaction,
): Promise<string> => {
  const { server, admin, adminSecretKey } = await getConfig();

  let call;

  call = Operation.extendFootprintTtl({ extendTo: MONTH_IN_LEDGERS * 5 });

  if (transactionType === Transactions.Restore) {
    call = Operation.restoreFootprint({});
  }

  const transaction = await baseTransaction(admin, call, keys, transactionType);

  const transactionPrepare = await server.prepareTransaction(transaction);

  transactionPrepare.sign(adminSecretKey);

  const response = await server.sendTransaction(transactionPrepare);
  return response.hash;
};

export default buildTransaction;
