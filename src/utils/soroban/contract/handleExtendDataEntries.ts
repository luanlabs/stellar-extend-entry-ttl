import { xdr } from 'stellar-sdk';

import log from '../../../logger';
import getConfig from '../getConfig';
import keysSplitter from './keysSplitter';
import finalizeTransaction from '../finalizeTransaction';
import logTransactionResult from './logTransactionResult';
import buildExtendTransaction from './buildTransaction';
import { Transactions } from '../../../types/Transactions';

const handleExtendDataEntires = async (keys: xdr.LedgerKey[]) => {
  try {
    const { server } = await getConfig();

    const splittedKeys = keysSplitter(keys, 40);

    for (let i = 0; i < splittedKeys.length; i++) {
      const txExtend = await buildExtendTransaction(splittedKeys[i], Transactions.Extend);
      const finalize = await finalizeTransaction(txExtend, server);

      logTransactionResult(finalize, splittedKeys[i]);
    }
  } catch (e) {
    log.error({ message: e.message });
  }
};

export default handleExtendDataEntires;
