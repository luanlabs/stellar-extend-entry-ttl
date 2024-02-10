import {
  Account,
  xdr,
  Networks,
  TransactionBuilder,
  Operation,
  SorobanDataBuilder,
} from 'stellar-sdk';

import getFee from './getFee';

const baseTransaction = async (
  admin: Account,
  call: xdr.Operation<Operation.InvokeHostFunction> | xdr.Operation<Operation.ExtendFootprintTTL>,
  keys?: xdr.LedgerKey[],
) => {
  const fee = getFee();

  let transaction = await new TransactionBuilder(admin, {
    fee,
    networkPassphrase: Networks.FUTURENET,
  });

  if (keys) {
    transaction = transaction.setSorobanData(new SorobanDataBuilder().setFootprint(keys).build());
  }

  transaction = transaction.addOperation(call);

  transaction = transaction.setTimeout(30);
  const transactionBuild = transaction.build();

  return transactionBuild;
};
export default baseTransaction;
