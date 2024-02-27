import { Address } from 'stellar-sdk';

import getTokens from '../soroban/getTokens';
import getConfig from '../soroban/getConfig';
import checkContractTTL from './checkContractTTL';
import checkDataEntry from './checkDataEntry';
import { Transactions } from '../../types/Transactions';

const getTokenKeysToExtend = async (lastLedger: number) => {
  const { admin, contract } = await getConfig();
  const tokens = await getTokens();
  const tokensToExtend = [];
  const tokensToRestore = [];

  for (let i = 0; i < tokens.length; i++) {
    const tokenContractKey = await checkContractTTL(tokens[i].address, lastLedger);

    if (tokenContractKey) {
      if (tokenContractKey.type === Transactions.Extend) {
        tokensToExtend.push(tokenContractKey.key);
      } else {
        tokensToRestore.push(tokenContractKey.key);
      }
    }

    const adminTokenBalanceKey = await checkDataEntry(
      tokens[i].address,
      'Balance',
      lastLedger,
      Address.fromString(admin.accountId()).toScVal(),
    );

    if (adminTokenBalanceKey) {
      if (adminTokenBalanceKey.type === Transactions.Extend) {
        tokensToExtend.push(adminTokenBalanceKey.key);
      } else {
        tokensToRestore.push(adminTokenBalanceKey.key);
      }
    }

    const contractTokenBalanceKey = await checkDataEntry(
      tokens[i].address,
      'Balance',
      lastLedger,
      contract.address().toScVal(),
    );

    if (contractTokenBalanceKey) {
      if (contractTokenBalanceKey.type === Transactions.Extend) {
        tokensToExtend.push(contractTokenBalanceKey.key);
      } else {
        tokensToRestore.push(contractTokenBalanceKey.key);
      }
    }
  }

  return { tokensToExtend, tokensToRestore };
};

export default getTokenKeysToExtend;
