const getFee = (): string => {
  return String(process.env.BASE_FEE) || '100000';
};
export default getFee;
