const userNamesapce = 'user/';
const tokenKey = `${userNamesapce}token`;

const setStorage = (key: string, val: unknown, isLocal: boolean): void => {
  if (isLocal) {
    localStorage.setItem(key, JSON.stringify(val));
    return;
  }

  sessionStorage.setItem(key, JSON.stringify(val));
};

const getStorage = <T>(key: string): T | null => {
  let res: string | null = null;

  res = sessionStorage.getItem(key);
  if (res) {
    return JSON.parse(res) as T;
  }

  res = localStorage.getItem(key);
  if (res) {
    return JSON.parse(res) as T;
  }

  return null;
};

export const setToken = (token: string, isLocal = false) => {
  setStorage(tokenKey, token, isLocal);
};
