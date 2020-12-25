/**
 * Handles key functions (getting/setting) of local storage.
 *
 * Based on https://github.com/bevacqua/local-storage but with necessary additions.
 */

import stub from './stub';
import { on as trackingOn, off as trackingOff } from './tracking';

let ls = 'localStorage' in global && global.localStorage ? global.localStorage : stub;

const has = (key) => {
  return key in ls && ls.getItem(key) !== undefined;
};

const get = (key) => {
  return has(key) ? JSON.parse(ls.getItem(key)) : null;
};

const remove = (key) => {
  return ls.removeItem(key);
};

const set = (key, value) => {
  try {
    // Avoid accidently setting null and undefined values as strings "null" and "undefined".
    // See: https://github.com/bevacqua/local-storage/pull/32
    if (value === null || value === undefined) {
      remove(key);
      return true;
    }
    ls.setItem(key, JSON.stringify(value));
    return true;
  } catch (e) {
    return false;
  }
};

const clear = () => {
  return ls.clear();
};

const backend = (store) => {
  if (store) ls = store;

  return ls;
};

/**
 * Lists all keys in local storage.
 * See: https://stackoverflow.com/a/17748203
 *
 * @returns {object} Dictionary of all local storage values.
 */
const keys = () => {
  return Object.keys(ls);
};

/**
 * Lists all values in local storage in an unsorted array.
 * See: https://stackoverflow.com/a/17748203
 */
const values = () => {
  const lsValues = [];
  const lsKeys = keys();
  let i = lsKeys.length;

  // eslint-disable-next-line no-cond-assign
  while ((i -= 1)) {
    lsValues.push(localStorage.getItem(lsKeys[i]));
  }

  return lsValues;
};

/**
 * Lists all keys and values in local storage.
 * See: https://stackoverflow.com/a/17748203
 *
 * @returns {object} Dictionary of all local storage values.
 */
const all = () => {
  const archive = {};
  const lsKeys = keys();
  let i = lsKeys.length;

  // Never thought the difference between -- and -= 1 would be relevant,
  // but this code previously broke the program completely
  // if i = 0 (aka a new user) because it used some weird language trick with i--.
  // eslint-disable-next-line no-cond-assign
  while (i > 0) {
    archive[lsKeys[i]] = ls.getItem(lsKeys[i]);
    i -= 1;
  }

  return archive;
};

const accessor = (key, value = null) => {
  if (value == null) {
    return get(key);
  }
  return set(key, value);
};

accessor.set = set;
accessor.get = get;
accessor.remove = remove;
accessor.clear = clear;
accessor.backend = backend;
accessor.on = trackingOn;
accessor.off = trackingOff;
accessor.keys = keys;
accessor.values = values;
accessor.all = all;

export default accessor;
