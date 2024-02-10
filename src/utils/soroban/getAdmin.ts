import { Keypair } from 'stellar-sdk';

const getAdmin = () => {
  return Keypair.fromSecret(String(process.env.ADMIN_SECRET_KEY));
};

export default getAdmin;
