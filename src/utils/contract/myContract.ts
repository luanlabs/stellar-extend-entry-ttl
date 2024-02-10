import { Durability } from 'stellar-sdk/lib/soroban';
import { SorobanRpc, xdr } from 'stellar-sdk';

const { scvVec, scvLedgerKeyContractInstance } = xdr.ScVal;

const server = new SorobanRpc.Server('https://rpc-futurenet.stellar.org');

export const dayLedger = 17280;
export const monthLedger = dayLedger * 30;

export class MyContract {
  public contract: string;

  constructor(contract: string) {
    this.contract = contract;
  }

  async getDataKeyTTL(dataKey: xdr.ScVal[]) {
    const result = await server.getContractData(
      this.contract,
      scvVec(dataKey),
      Durability.Persistent,
    );

    return {
      liveLedger: result.liveUntilLedgerSeq,
      lastLedger: result.lastModifiedLedgerSeq,
      key: result.key,
    };
  }

  async getContractTTL() {
    const result = await server.getContractData(
      this.contract,
      scvLedgerKeyContractInstance(),
      Durability.Persistent,
    );

    return {
      liveLedger: result.liveUntilLedgerSeq,
      lastLedger: result.lastModifiedLedgerSeq,
      key: result.key,
    };
  }
}
