import { xdr } from 'stellar-sdk';

import log from '../../../logger';
import getConfig from '../getConfig';
import finalizeTransaction from '../finalizeTransaction';
import buildExtendTransaction from './extendTransaction';

const handleExtendDataEntires = async (keys: xdr.LedgerKey[]) => {
  try {
    const { server } = await getConfig();

    for (let i = 0; i < Math.ceil(keys.length / 40); i++) {
      const keysSplit = keys.slice(i * 40, (i + 1) * 40);
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
