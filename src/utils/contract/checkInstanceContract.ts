import { Address, xdr } from 'stellar-sdk';

import { MyContract, dayLedger } from './myContract';

const { scvSymbol } = xdr.ScVal;

const checkInstanceContract = async (
  contract: string,
  dataKey: string,
  lastLedger: number,
  data?: string,
) => {
  const selectContract = new MyContract(contract);

  const listKey: xdr.ScVal[] = [scvSymbol(dataKey)];

  if (data) {
    listKey.push(Address.fromString(data).toScVal());
  }

  const { liveLedger, key } = await selectContract.getDataKeyTTL(listKey);

  if (Number(liveLedger) - Number(lastLedger) <= dayLedger - 1000) {
    return key;
  }

  return undefined;
};

export default checkInstanceContract;
