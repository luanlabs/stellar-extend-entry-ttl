import log from '../logger';
import getConfig from '../utils/soroban/getConfig';
import checkContractTTL from '../utils/contract/checkContractTTL';
import getLatestStreamId from '../utils/soroban/getLatestStreamId';
import getTokenKeysToExtend from '../utils/contract/getTokenKeys';
import getStreamKeysToExtend from '../utils/contract/getStreamKeys';
import handleExtendDataEntires from '../utils/soroban/contract/handleExtendDataEntries';
import handleRestoreDataEntires from '../utils/soroban/contract/handleRestoreDataEntries';
import { DAY_IN_SECONDS } from '../constants/ledgerTime';

const checkTTLData = async () => {
  try {
    const { server, contract } = await getConfig();
    const { sequence: lastLedger } = await server.getLatestLedger();

    const latestStreamId = await getLatestStreamId();

    const { streamsToExtend, streamsToRestore } = await getStreamKeysToExtend(
      latestStreamId,
      lastLedger,
    );
    const { tokensToExtend, tokensToRestore } = await getTokenKeysToExtend(lastLedger);

    const keysToExtend = [...streamsToExtend, ...tokensToExtend];
    const keysToRestore = [...streamsToRestore, ...tokensToRestore];

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
