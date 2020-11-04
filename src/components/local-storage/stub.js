/**
 * On unsupported platforms, use browser memory as local storage.
 */

let memoryStorage = {};

function getItem(key) {
  return key in memoryStorage ? memoryStorage[key] : null;
}

function setItem(key, value) {
  memoryStorage[key] = value;
  return true;
}

function removeItem(key) {
  const found = key in memoryStorage;
  if (found) {
    return delete memoryStorage[key];
  }
  return false;
}

function clear() {
  memoryStorage = {};
  return true;
}

const stub = {
  getItem,
  setItem,
  removeItem,
  clear,
};

export default stub;
