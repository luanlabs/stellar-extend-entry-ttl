import { Address } from 'stellar-sdk';

import getTokens from '../soroban/getTokens';
import getConfig from '../soroban/getConfig';
import checkContractTTL from './checkContractTTL';
import checkInstanceContract from './checkInstanceContract';

const getTokenKeysToExtend = async (lastLedger: number) => {
  const { admin } = await getConfig();
  const tokens = await getTokens();
  const tokensToExtend = [];
  const tokensToRestore = [];

  for (let i = 0; i < tokens.length; i++) {
    const tokenContractKey = await checkContractTTL(tokens[i].address, lastLedger);

    if (tokenContractKey) {
      if (tokenContractKey.type === 'extend') {
        tokensToExtend.push(tokenContractKey.key);
      } else {
        tokensToRestore.push(tokenContractKey.key);
      }
    }

    const tokenBalanceKey = await checkInstanceContract(
      tokens[i].address,
      'Balance',
      lastLedger,
      Address.fromString(admin.accountId()).toScVal(),
    );

    if (tokenBalanceKey) {
      if (tokenBalanceKey.type === 'extend') {
        tokensToExtend.push(tokenBalanceKey.key);
      } else {
        tokensToRestore.push(tokenBalanceKey.key);
      }
    }
  }

  return { tokensToExtend, tokensToRestore };
};

export default getTokenKeysToExtend;
