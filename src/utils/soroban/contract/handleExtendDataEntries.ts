import { xdr } from 'stellar-sdk';

import buildExtendTransaction from './extendTransaction';
import finalizeTransaction from '../finalizeTransaction';
import getConfig from '../getConfig';
import log from '../../../logger';

const handleExtendDataEntires = async (keys: xdr.LedgerKey[]) => {
  try {
    const { server } = await getConfig();

    for (let i = 0; i < Math.ceil(keys.length / 100); i++) {
      const keysSplit = keys.slice(i * 100, (i + 1) * 100);
      const txExtend = await buildExtendTransaction(keysSplit);
      const finalize = await finalizeTransaction(txExtend, server);

      if (finalize) {
        for (let j = 0; j < keysSplit.length; j++) {
          log.warn({ message: 'extended datakey : ' + keysSplit[j] });
        }
      } else {
        log.error({ message: 'Transaction failed' });
      }
    }
  } catch (e) {
    log.error({ message: e.message });
  }
};

export default handleExtendDataEntires;
