import { dayLedger } from '../utils/contract/myContract';
import getConfig from '../utils/soroban/getConfig';
import getLatestStreamId from '../utils/soroban/getLatestStreamId';
import getLinerStreamId from '../utils/contract/getLinerStreamId';
import finalizeTransaction from '../utils/soroban/finalizeTransaction';
import checkInstanceContract from '../utils/contract/checkInstanceContract';
import buildExtendTransaction from '../utils/soroban/contract/extendTransaction';
import checkContractTTL from '../utils/contract/checkContractTTL';
import getToken from '../utils/soroban/getTokens';
import getAdmin from '../utils/soroban/getAdmin';
import { Network } from '../types/networkType';
import log from '../logger';

const checkTTLData = async (network: Network) => {
  try {
    const { server, contract } = await getConfig(network);
    const admin = await server.getAccount(getAdmin().publicKey());
    const lastLedger = (await server.getLatestLedger()).sequence;

    const lastId = await getLatestStreamId(network);
    let useId = 0;

    const promiseStreams = [];

    while (useId < Number(lastId)) {
      const ledgerKey = getLinerStreamId(network, String(useId), lastLedger);
      promiseStreams.push(ledgerKey);
      useId += 1;
    }

    const filteredStreams = (await Promise.all(promiseStreams)).filter(
      ({ liveLedger, lastLedger }) => {
        return Number(liveLedger) - Number(lastLedger) <= dayLedger - 1000;
      },
    );

    const keys = filteredStreams.map(({ key }) => key);

    const tokens = await getToken();

    for (let i = 0; i < tokens.length; i++) {
      const ContractKey = await checkContractTTL(tokens[i].address, lastLedger);
      if (ContractKey) {
        keys.push(ContractKey);
      }

      const balanceKey = await checkInstanceContract(
        tokens[i].address,
        'Balance',
        lastLedger,
        getAdmin().publicKey(),
      );
      if (balanceKey) {
        keys.push(balanceKey);
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

    if (keys.length > 0) {
      const extendTx = await buildExtendTransaction(admin, keys, network);
      await finalizeTransaction(extendTx, server);
    }

    setTimeout(checkTTLData, 84600000, 'testnet');
  } catch (e) {
    log.fatal({ message: e.message });
  }
};

export default checkTTLData;
