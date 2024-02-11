import { DAY_IN_LEDGERS } from '../../constants/ledger';
import { SorobanContract } from './SorobanContrcat';
import BN from '../BN';

const checkContractTTL = async (contract: string, lastLedger: number) => {
  const selectContract = new SorobanContract(contract);

  const { liveLedger, key } = await selectContract.getContractTTL();

  if (liveLedger) {
    if (new BN(liveLedger).minus(lastLedger) <= new BN(DAY_IN_LEDGERS + 1000)) {
      return key;
    }
  }

  return null;
};

export default checkContractTTL;
