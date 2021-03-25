/**
 * On unsupported platforms, use browser memory as local storage.
 */

let memoryStorage: { [key: string]: any } = {};

const getItem = (key: string): any => {
  return key in memoryStorage ? memoryStorage[key] : null;
};

const setItem = (key: string, value: unknown): boolean => {
  memoryStorage[key] = value;
  return true;
};

const removeItem = (key: string): boolean => {
  const found = key in memoryStorage;
  if (found) {
    return delete memoryStorage[key];
  }
  return false;
};

const clear = (): boolean => {
  memoryStorage = {};
  return true;
};

const stub = {
  getItem,
  setItem,
  removeItem,
  clear,
};

export default stub;
