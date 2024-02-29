import { xdr } from 'stellar-sdk';

const keysSplitter = (keys: xdr.LedgerKey[], splitSize: number) => {
  const keysSplit = [];

  for (let i = 0; i < Math.ceil(keys.length / splitSize); i++) {
    keysSplit.push(keys.slice(i * splitSize, (i + 1) * splitSize));
  }

  return keysSplit;
};

export default keysSplitter;
