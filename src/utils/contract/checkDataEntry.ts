import { xdr } from 'stellar-sdk';

import { SorobanContract } from './SorobanContrcat';
import checkLedgerTTL from './checkLedgerTTL';

const { ScVal } = xdr;
const { scvSymbol } = ScVal;

const checkDataEntry = async (
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

  return checkLedgerTTL(Number(liveLedger), lastLedger, message, key);
};

export default checkDataEntry;
