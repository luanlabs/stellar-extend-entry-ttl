import checkLedgerTTL from './checkLedgerTTL';
import { SorobanContract } from './SorobanContrcat';

const checkContractTTL = async (contract: string, lastLedger: number) => {
  const selectContract = new SorobanContract(contract);

  const { liveLedger, key } = await selectContract.getContractTTL();

  const message = liveLedger + ' --- ' + lastLedger + ' -> ' + contract;

  return checkLedgerTTL(Number(liveLedger), lastLedger, message, key);
};

export default checkContractTTL;
