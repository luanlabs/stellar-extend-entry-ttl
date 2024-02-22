import { DAY_IN_LEDGERS } from '../../constants/ledger';
import { SorobanContract } from './SorobanContrcat';
import BN from '../BN';
import log from '../../logger';

const checkContractTTL = async (contract: string, lastLedger: number) => {
  const selectContract = new SorobanContract(contract);

  const { liveLedger, key } = await selectContract.getContractTTL();

  const message = liveLedger + ' --- ' + lastLedger + ' -> ' + contract;
  console.log(message);

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

export default checkContractTTL;
