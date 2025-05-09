import log from '../logger';

const request = async (url: string, config?: RequestInit) => {
  let isRequestPending = true;
  while (isRequestPending) {
    try {
      const response = await fetch(url, config);
      const data = await response.json();

      if (response.status >= 400) {
        log.warn({ message: { data, response } });
        throw { data, response };
      }

      isRequestPending = false;
      return data;
    } catch (error) {
      log.error({ message: error.message });
      throw error;
    }
  }
};

export default request;
