import { xdr } from 'stellar-sdk';

import { SorobanContract } from './SorobanContrcat';
import { DAY_IN_LEDGERS } from '../../constants/ledger';
import BN from '../BN';
import log from '../../logger';

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
  const message = liveLedger + ' --- ' + lastLedger + ' -> ' + dataKey + '(' + data?.value() + ')';

  if (liveLedger) {
    if (liveLedger < lastLedger) {
      return { key, type: 'restore' };
    }

    if (
      new BN(liveLedger).minus(lastLedger).toNumber() <= DAY_IN_LEDGERS * 5 &&
      liveLedger > lastLedger
    ) {
      log.warn({ message });
      return { key, type: 'extend' };
    }
  }

  return null;
};

export default checkInstanceContract;
