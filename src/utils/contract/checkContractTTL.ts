import { MyContract, dayLedger } from './myContract';

const checkContractTTL = async (contract: string, lastLedger: number) => {
  const selectContract = new MyContract(contract);

  const { liveLedger, key } = await selectContract.getContractTTL();

  if (Number(liveLedger) - Number(lastLedger) <= dayLedger - 1000) {
    return key;
  }

  return undefined;
};

export default checkContractTTL;
