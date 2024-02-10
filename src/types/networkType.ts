/* eslint-disable @typescript-eslint/no-namespace */
export type Network = 'mainnet' | 'testnet';

declare global {
  namespace Express {
    interface Response {
      network: Network;
    }
  }
}
