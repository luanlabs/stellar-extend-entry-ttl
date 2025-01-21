import log from '../logger';
import getConfig from '../utils/soroban/getConfig';
import { DAY_IN_SECONDS } from '../constants/ledgerTime';
import getLockupKeys from '../utils/contract/getLockupKeys';
import checkContractTTL from '../utils/contract/checkContractTTL';
import getTokenKeysToExtend from '../utils/contract/getTokenKeys';
import getLatestLockupId from '../utils/soroban/getLatestLockupId';
import handleExtendDataEntires from '../utils/soroban/contract/handleExtendDataEntries';
import handleRestoreDataEntires from '../utils/soroban/contract/handleRestoreDataEntries';

const checkTTLData = async () => {
  try {
    const { server, contract } = await getConfig();
    const { sequence: lastLedger } = await server.getLatestLedger();

    const latestLockupId = await getLatestLockupId();

    const { lockupsToExtend, lockupsToRestore } = await getLockupKeys(latestLockupId, lastLedger);
    const { tokensToExtend, tokensToRestore } = await getTokenKeysToExtend(lastLedger);

    const keysToExtend = [...lockupsToExtend, ...tokensToExtend];
    const keysToRestore = [...lockupsToRestore, ...tokensToRestore];

    const fluxityContractKey = await checkContractTTL(contract.address().toString(), lastLedger);
    if (fluxityContractKey) {
      if (fluxityContractKey.type === 'extend') {
        keysToExtend.push(fluxityContractKey.key);
      } else {
        keysToRestore.push(fluxityContractKey.key);
      }
    }

    if (keysToRestore.length) {
      await handleRestoreDataEntires(keysToRestore);
    }

    if (keysToExtend.length) {
      await handleExtendDataEntires(keysToExtend);
    }

    await new Promise((resolve) => setTimeout(resolve, DAY_IN_SECONDS));
    checkTTLData();
  } catch (e) {
    log.fatal({ message: e.message });
  }
};

export default checkTTLData;
