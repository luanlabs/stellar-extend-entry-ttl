import { xdr } from 'stellar-sdk';

import buildExtendTransaction from './extendTransaction';
import finalizeTransaction from '../finalizeTransaction';
import getConfig from '../getConfig';

const handleExtendDataEntires = async (keys: xdr.LedgerKey[]) => {
  const { server } = await getConfig();

  for (let i = 0; i < Math.ceil(keys.length / 100); i++) {
    await finalizeTransaction(
      await buildExtendTransaction(keys.slice(i * 100, (i + 1) * 100)),
      server,
    );
  }
};

export default handleExtendDataEntires;
