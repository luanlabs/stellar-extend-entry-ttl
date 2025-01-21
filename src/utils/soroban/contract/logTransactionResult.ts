import { xdr, rpc } from '@stellar/stellar-sdk';

import log from '../../../logger';

const logTransactionResult = (
  finalize: false | rpc.Api.GetSuccessfulTransactionResponse,
  keysSplit: xdr.LedgerKey[],
) => {
  if (finalize) {
    for (let j = 0; j < keysSplit.length; j++) {
      const message = 'Transaction sucsesed. datakey : ' + keysSplit[j];
      log.warn({ message });
    }
  } else {
    for (let j = 0; j < keysSplit.length; j++) {
      const message = 'Transaction failed. datakey : ' + keysSplit[j];

      log.error({ message });
    }
  }
};

export default logTransactionResult;
