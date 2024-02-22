import BN from '../BN';
import log from '../../logger';
import { DAY_IN_LEDGERS } from '../../constants/ledger';
import { SorobanContract } from './SorobanContrcat';

const checkContractTTL = async (contract: string, lastLedger: number) => {
  const selectContract = new SorobanContract(contract);

  const { liveLedger, key } = await selectContract.getContractTTL();

  const message = liveLedger + ' --- ' + lastLedger + ' -> ' + contract;

  if (liveLedger) {
    if (liveLedger < lastLedger) {
      log.info({ message });
      return { key, type: 'restore' };
    }

    if (
      new BN(liveLedger).minus(lastLedger).toNumber() <= DAY_IN_LEDGERS * 5 &&
      liveLedger > lastLedger
    ) {
      log.info({ message });
      return { key, type: 'extend' };
    }
  }

  return null;
};

export default checkContractTTL;
