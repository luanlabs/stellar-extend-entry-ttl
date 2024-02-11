import { Address, xdr } from 'stellar-sdk';

import getConfig from '../utils/soroban/getConfig';
import getLatestStreamId from '../utils/soroban/getLatestStreamId';
import checkInstanceContract from '../utils/contract/checkInstanceContract';
import checkContractTTL from '../utils/contract/checkContractTTL';
import getTokens from '../utils/soroban/getTokens';
import log from '../logger';
import { DAY_IN_SECONDS } from '../constants/seconds';
import handleExtendDataEntires from '../utils/soroban/contract/handleExtendDataEntries';

const { Uint64, ScVal } = xdr;
const { scvU64 } = ScVal;

const checkTTLData = async () => {
  try {
    const { server, contract, admin } = await getConfig();
    const lastLedger = (await server.getLatestLedger()).sequence;

    const latestStreamId = await getLatestStreamId();

    const promiseStreams = [];

    for (let i = 0; i < latestStreamId; i++) {
      const ledgerKey = checkInstanceContract(
        contract.address().toString(),
        'LinearStream',
        lastLedger,
        scvU64(Uint64.fromString(i.toString())),
      );
      promiseStreams.push(ledgerKey);
    }

    const streams = await Promise.all(promiseStreams);
    const filteredStreams = streams.filter((key): key is xdr.LedgerKey => key !== null);

    const keys = filteredStreams;
    const tokens = await getTokens();

    for (let i = 0; i < tokens.length; i++) {
      const tokenContractKey = await checkContractTTL(tokens[i].address, lastLedger);
      if (tokenContractKey) {
        keys.push(tokenContractKey);
      }

      const tokenBalanceKey = await checkInstanceContract(
        tokens[i].address,
        'Balance',
        lastLedger,
        Address.fromString(admin.accountId()).toScVal(),
      );
      if (tokenBalanceKey) {
        keys.push(tokenBalanceKey);
      }
    }

    const fluxityContractKey = await checkContractTTL(contract.address().toString(), lastLedger);
    if (fluxityContractKey) {
      keys.push(fluxityContractKey);
    }

    const latestStreamIdKey = await checkInstanceContract(
      contract.address().toString(),
      'LatestStreamId',
      lastLedger,
    );
    if (latestStreamIdKey) {
      keys.push(latestStreamIdKey);
    }

    if (keys.length) {
      handleExtendDataEntires(keys);
    }

    await new Promise((resolve) => setTimeout(resolve, DAY_IN_SECONDS));
    checkTTLData();
  } catch (e) {
    log.fatal({ message: e.message });
  }
};

export default checkTTLData;
