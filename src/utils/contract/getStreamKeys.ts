import { xdr } from 'stellar-sdk';

import { KeyType } from '../../constants/keyType';
import getConfig from '../soroban/getConfig';
import checkInstanceContract from './checkInstanceContract';

const { Uint64, ScVal } = xdr;
const { scvU64 } = ScVal;

const getStreamKeys = async (lastId: bigint, lastLedger: number) => {
  const { contract } = await getConfig();

  const promiseStreams = [];

  for (let i = 0; i < lastId; i++) {
    const ledgerKey = checkInstanceContract(
      contract.address().toString(),
      'LinearStream',
      lastLedger,
      scvU64(Uint64.fromString(i.toString())),
    );
    promiseStreams.push(ledgerKey);
  }

  const streams = await Promise.all(promiseStreams);
  const streamsToExtend = streams
    .filter((value): value is KeyType => value !== null && value.type === 'extend')
    .map((value) => {
      return value.key;
    });

  const streamsToRestore = streams
    .filter((value): value is KeyType => value !== null && value.type === 'restore')
    .map((value) => {
      return value.key;
    });

  return { streamsToExtend, streamsToRestore };
};

export default getStreamKeys;
