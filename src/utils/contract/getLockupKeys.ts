import { xdr } from 'stellar-sdk';

import { KeyType } from '../../types/keyType';
import getConfig from '../soroban/getConfig';
import checkDataEntry from './checkDataEntry';

const { Uint64, ScVal } = xdr;
const { scvU64 } = ScVal;

const getLockupKeys = async (lastId: bigint, lastLedger: number) => {
  const { contract } = await getConfig();

  const promiseLockups = [];

  for (let i = 0; i < lastId; i++) {
    const ledgerKey = checkDataEntry(
      contract.address().toString(),
      'Lockup',
      lastLedger,
      scvU64(Uint64.fromString(i.toString())),
    );
    promiseLockups.push(ledgerKey);
  }

  const lockups = await Promise.all(promiseLockups);
  const lockupsToExtend = lockups
    .filter((value): value is KeyType => value !== null && value.type === 'extend')
    .map((value) => {
      return value.key;
    });

  const lockupsToRestore = lockups
    .filter((value): value is KeyType => value !== null && value.type === 'restore')
    .map((value) => {
      return value.key;
    });

  return { lockupsToExtend, lockupsToRestore };
};

export default getLockupKeys;
