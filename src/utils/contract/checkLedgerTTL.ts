import { xdr } from 'stellar-sdk';

import BN from '../BN';
import log from '../../logger';
import { DAY_IN_LEDGERS } from '../../constants/ledgerTime';

const checkLedgerTTL = (
  liveLedger: number,
  lastLedger: number,
  message: string,
  key: xdr.LedgerKey,
) => {
  if (liveLedger) {
    if (liveLedger > lastLedger) {
      log.info({ message });
      return { key, type: 'restore' };
    }

    if (
      new BN(liveLedger).minus(lastLedger).toNumber() <= DAY_IN_LEDGERS * 5 &&
      liveLedger > lastLedger
    ) {
      log.info({ message });
      return { key, type: 'extend' };
    }
  }
  return null;
};

export default checkLedgerTTL;
