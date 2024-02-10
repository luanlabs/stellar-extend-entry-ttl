import { Account, Operation, xdr } from 'stellar-sdk';

import getConfig from '../getConfig';
import baseTransaction from '../baseTransaction';
import getAdmin from '../getAdmin';
import { Network } from '../../../types/networkType';
import { monthLedger } from '../../contract/myContract';

const buildExtendTransaction = async (
  admin: Account,
  keys: xdr.LedgerKey[],
  network: Network,
): Promise<string> => {
  const { server } = await getConfig(network);
  const adminAccount = getAdmin();

  const call = Operation.extendFootprintTtl({ extendTo: monthLedger * 6 });

  const transaction = await baseTransaction(admin, call, keys);

  const transactionPrepare = await server.prepareTransaction(transaction);

  transactionPrepare.sign(adminAccount);

  const response = await server.sendTransaction(transactionPrepare);
  return response.hash;
};

export default buildExtendTransaction;
