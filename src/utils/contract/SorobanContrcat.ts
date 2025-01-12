import { xdr, rpc } from '@stellar/stellar-sdk';
import getConfig from '../soroban/getConfig';

const { scvVec, scvLedgerKeyContractInstance } = xdr.ScVal;

export class SorobanContract {
  public contract: string;

  constructor(contract: string) {
    this.contract = contract;
  }

  async getDataKeyTTL(dataKey: xdr.ScVal[]) {
    const { server } = await getConfig();

    const result = await server.getContractData(
      this.contract,
      scvVec(dataKey),
      rpc.Durability.Persistent,
    );

    return {
      liveLedger: result.liveUntilLedgerSeq,
      lastLedger: result.lastModifiedLedgerSeq,
      key: result.key,
    };
  }

  async getContractTTL() {
    const { server } = await getConfig();

    const result = await server.getContractData(
      this.contract,
      scvLedgerKeyContractInstance(),
      rpc.Durability.Persistent,
    );

    return {
      liveLedger: result.liveUntilLedgerSeq,
      lastLedger: result.lastModifiedLedgerSeq,
      key: result.key,
    };
  }
}
