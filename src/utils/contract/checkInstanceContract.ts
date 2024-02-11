import { xdr } from 'stellar-sdk';

import { SorobanContract } from './SorobanContrcat';
import { DAY_IN_LEDGERS } from '../../constants/ledger';
import BN from '../BN';

const { ScVal } = xdr;
const { scvSymbol } = ScVal;

const checkInstanceContract = async (
  contract: string,
  dataKey: string,
  lastLedger: number,
  data?: xdr.ScVal,
) => {
  const selectContract = new SorobanContract(contract);

  const listKey = [scvSymbol(dataKey)];

  if (data) {
    listKey.push(data);
  }

  const { liveLedger, key } = await selectContract.getDataKeyTTL(listKey);

  if (liveLedger) {
    if (new BN(liveLedger).minus(lastLedger) <= new BN(DAY_IN_LEDGERS + 1000)) {
      return key;
    }
  }

  return null;
};

export default checkInstanceContract;
