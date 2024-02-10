import { xdr } from 'stellar-sdk';

import { Network } from '../../types/networkType';
import { MyContract } from './myContract';
import getConfig from '../soroban/getConfig';

const { scvSymbol, scvU64 } = xdr.ScVal;

const getLinerStreamId = async (network: Network, id: string, lastLedger: number) => {
  const { contract } = await getConfig(network);
  const fluxityContract = new MyContract(contract.address().toString());
  const linerId = xdr.Uint64.fromString(id);

  const { liveLedger, key } = await fluxityContract.getDataKeyTTL([
    scvSymbol('LinearStream'),
    scvU64(linerId),
  ]);

  return { liveLedger, lastLedger, key };
};

export default getLinerStreamId;
