import { xdr } from '@stellar/stellar-sdk';

import log from '../../../logger';
import getConfig from '../getConfig';
import keysSplitter from './keysSplitter';
import finalizeTransaction from '../finalizeTransaction';
import logTransactionResult from './logTransactionResult';
import buildRestoreTransaction from './buildTransaction';
import { Transactions } from '../../../types/Transactions';

const handleRestoreDataEntires = async (keys: xdr.LedgerKey[]) => {
  try {
    const { server } = await getConfig();

    const splittedKeys = keysSplitter(keys, 20);

    for (let i = 0; i < splittedKeys.length; i++) {
      const txRestore = await buildRestoreTransaction(splittedKeys[i], Transactions.Restore);
      const finalize = await finalizeTransaction(txRestore, server);

      logTransactionResult(finalize, splittedKeys[i]);
    }
  } catch (e) {
    log.error({ message: e.message });
  }
};

export default handleRestoreDataEntires;
