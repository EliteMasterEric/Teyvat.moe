/**
 * Handles key functions (getting/setting) of local storage.
 *
 * Based on https://github.com/bevacqua/local-storage but with necessary additions.
 */
/* eslint-disable no-restricted-imports */

import _ from 'lodash';
import stub from './Stub';
import { on as trackingOn, off as trackingOff } from './Tracking';

let ls = 'localStorage' in global && global.localStorage ? global.localStorage : stub;

const has = (key: string) => {
  return key in ls && ls.getItem(key) !== undefined;
};

const get = (key: string) => {
  return has(key) ? JSON.parse(ls.getItem(key)) : null;
};

const remove = (key: string) => {
  return ls.removeItem(key);
};

const set = (key: string, value: any) => {
  try {
    // Avoid accidently setting null and undefined values as strings "null" and "undefined".
    // See: https://github.com/bevacqua/local-storage/pull/32
    if (_.isNil(value)) {
      remove(key);
      return true;
    }
    ls.setItem(key, JSON.stringify(value));
    return true;
  } catch {
    return false;
  }
};

const clear = () => {
  return ls.clear();
};

const backend = (store: any) => {
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
  return _.keys(ls);
};

/**
 * Lists all values in local storage in an unsorted array.
 * See: https://stackoverflow.com/a/17748203
 */
const values = () => {
  const lsValues: any[] = [];
  const lsKeys = keys();

  // eslint-disable-next-line no-cond-assign
  for (const lsKey of lsKeys) {
    lsValues.push(localStorage.getItem(lsKey));
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
  const archive: { [key: string]: any } = {};
  const lsKeys = keys();

  // Never thought the difference between -- and -= 1 would be relevant,
  // but this code previously broke the program completely
  // if i = 0 (aka a new user) because it used some weird language trick with i--.

  // It has seen been rewritten.
  for (const lsKey of lsKeys) {
    archive[lsKey] = ls.getItem(lsKey);
  }

  return archive;
};

const accessor = (key: string, value: any | null = null): any => {
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
