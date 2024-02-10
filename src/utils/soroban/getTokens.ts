import request from '../request';

const getToken = async () => {
  const config = {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
  };

  let tokens = await request('https://api.fluxity.finance/testnet/token', config);
  tokens = tokens.result.filter((token: { claimable: boolean }) => {
    return token.claimable === true;
  });

  return tokens;
};
export default getToken;
