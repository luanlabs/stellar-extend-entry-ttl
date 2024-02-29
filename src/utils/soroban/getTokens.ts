import request from '../request';

const getTokens = async () => {
  const config = {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
  };

  const tokens = await request(String(process.env.API_URL), config);
  const tokenClaimable = tokens.result.filter((token: { claimable: boolean }) => token.claimable);

  return tokenClaimable;
};
export default getTokens;
