import { xdr } from 'stellar-sdk';

export type KeyType = {
  key: xdr.LedgerKey;
  type: 'restore' | 'extend';
};
