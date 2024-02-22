import { xdr } from 'stellar-sdk';

import buildRestoreTransaction from './restoreTransaction';
import finalizeTransaction from '../finalizeTransaction';
import getConfig from '../getConfig';
import log from '../../../logger';

const handleRestoreDataEntires = async (keys: xdr.LedgerKey[]) => {
  try {
    const { server } = await getConfig();

    for (let i = 0; i < Math.ceil(keys.length / 20); i++) {
      const keysSplit = keys.slice(i * 20, (i + 1) * 20);
      const txRestore = await buildRestoreTransaction(keysSplit);
      const finalize = await finalizeTransaction(txRestore, server);
      if (finalize) {
        for (let j = 0; j < keysSplit.length; j++) {
          log.warn({ message: 'Restored datakey : ' + keysSplit[j] });
        }
      } else {
        log.error({ message: 'Transaction failed' });
      }
    }
  } catch (e) {
    log.error({ message: e.message });
  }
};

export default handleRestoreDataEntires;
