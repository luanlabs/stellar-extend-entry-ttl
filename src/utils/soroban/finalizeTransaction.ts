import { SorobanRpc } from 'stellar-sdk';

import log from '../../logger';

const finalizeTransaction = async (hash: string, server: SorobanRpc.Server) => {
  for (let index = 0; index < 10; index++) {
    const tx = await server.getTransaction(hash);

    if (tx.status === 'FAILED') {
      return log.error({ message: 'Transaction feild' });
    }
    if (tx.status !== 'NOT_FOUND') {
      return tx;
    }

    await new Promise((resolve) => setTimeout(resolve, 1000));
  }
  log.error({ message: 'Transaction feild' });
  throw Error;
};

export default finalizeTransaction;
