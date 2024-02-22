import log from '../logger';
import getConfig from '../utils/soroban/getConfig';
import getLatestStreamId from '../utils/soroban/getLatestStreamId';
import checkInstanceContract from '../utils/contract/checkInstanceContract';
import checkContractTTL from '../utils/contract/checkContractTTL';
import handleExtendDataEntires from '../utils/soroban/contract/handleExtendDataEntries';
import handleRestoreDataEntires from '../utils/soroban/contract/handleRestoreDataEntries';
import getStreamKeysToExtend from '../utils/contract/getStreamKeys';
import getTokenKeysToExtend from '../utils/contract/getTokenKeys';
import { DAY_IN_SECONDS } from '../constants/seconds';

const checkTTLData = async () => {
  try {
    const { server, contract } = await getConfig();
    const lastLedger = (await server.getLatestLedger()).sequence;

    const latestStreamId = await getLatestStreamId();

    const { streamsToExtend, streamsToRestore } = await getStreamKeysToExtend(
      latestStreamId,
      lastLedger,
    );
    const { tokensToExtend, tokensToRestore } = await getTokenKeysToExtend(lastLedger);

    const keysToExtend = streamsToExtend.concat(tokensToExtend);
    const keysToRestore = streamsToRestore.concat(tokensToRestore);

    const fluxityContractKey = await checkContractTTL(contract.address().toString(), lastLedger);
    if (fluxityContractKey) {
      if (fluxityContractKey.type === 'extend') {
        keysToExtend.push(fluxityContractKey.key);
      } else {
        keysToRestore.push(fluxityContractKey.key);
      }
    }

    const latestStreamIdKey = await checkInstanceContract(
      contract.address().toString(),
      'LatestStreamId',
      lastLedger,
    );
    if (latestStreamIdKey) {
      if (latestStreamIdKey.type === 'extend') {
        keysToExtend.push(latestStreamIdKey.key);
      } else {
        keysToRestore.push(latestStreamIdKey.key);
      }
    }

    if (keysToRestore.length) {
      console.log('start restore');
      handleRestoreDataEntires(keysToRestore);
    }

    if (keysToExtend.length) {
      console.log('strart extend');
      handleExtendDataEntires(keysToExtend);
    }

    await new Promise((resolve) => setTimeout(resolve, DAY_IN_SECONDS));
    checkTTLData();
  } catch (e) {
    log.fatal({ message: e.message });
  }
};

export default checkTTLData;
