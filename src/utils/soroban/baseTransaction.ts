import {
  Account,
  xdr,
  Networks,
  TransactionBuilder,
  Operation,
  SorobanDataBuilder,
} from 'stellar-sdk';

import getConfig from './getConfig';
import { TTransaction, Transactions } from '../../types/Transactions';

const baseTransaction = async (
  admin: Account,
  call:
    | xdr.Operation<Operation.InvokeHostFunction>
    | xdr.Operation<Operation.ExtendFootprintTTL>
    | xdr.Operation<Operation.RestoreFootprint>,
  keys?: xdr.LedgerKey[],
  type?: TTransaction,
) => {
  const { fee } = await getConfig();

  let transaction = await new TransactionBuilder(admin, {
    fee,
    networkPassphrase: Networks.FUTURENET,
  });

  if (keys) {
    if (type === Transactions.Extend) {
      transaction = transaction.setSorobanData(new SorobanDataBuilder().setFootprint(keys).build());
    } else {
      transaction = transaction.setSorobanData(new SorobanDataBuilder().setReadWrite(keys).build());
    }
  }

  transaction = transaction.addOperation(call);

  transaction = transaction.setTimeout(30);
  const transactionBuild = transaction.build();

  return transactionBuild;
};
export default baseTransaction;
