import { xdr } from '@stellar/stellar-sdk';

import { TTransaction } from './Transactions';

export type KeyType = {
  key: xdr.LedgerKey;
  type: TTransaction;
};
