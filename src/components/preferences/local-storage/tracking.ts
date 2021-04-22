/**
 * Handles listeners for local-storage.
 */

import _ from 'lodash';

const listeners: { [key: string]: ListenerFunction[] } = {};
const listening = false;

const change = (event: StorageEvent) => {
  if (
    !event && // eslint-disable-next-line no-param-reassign
    global.event != null
  ) {
    event = global.event as StorageEvent;
  }
  if (event.key == null) return;

  const all = listeners[event.key];
  if (all) {
    // Fire each listener function.
    _.forEach(all, (listener) => {
      listener(
        JSON.parse(event?.newValue ?? ''),
        JSON.parse(event?.oldValue ?? ''),
        event?.url ?? ''
      );
    });
  }
};

function listen() {
  const castGlobal = global as any;
  if (castGlobal.addEventListener) {
    castGlobal.addEventListener('storage', change, false);
  } else if (castGlobal.attachEvent) {
    castGlobal.attachEvent('onstorage', change);
  } else {
    castGlobal.onstorage = change;
  }
}

/**
 * Attaches an event listener that is triggered when the key changes.
 * @param {*} key The local storage key.
 * @param {*} fn A function that takes (newData, oldData, url)
 */
type ListenerFunction = (newData: any, oldData: any, url: string) => void;
export const on = (key: string, function_: ListenerFunction): void => {
  const ls = listeners[key];
  if (ls != null) {
    listeners[key] = [...ls, function_];
  } else {
    listeners[key] = [function_];
  }
  if (listening === false) {
    listen();
  }
};

export const off = (key: string, function_: ListenerFunction): void => {
  const ns = listeners[key];
  if (ns != null && ns.length > 1) {
    ns.splice(ns.indexOf(function_), 1);
  } else {
    listeners[key] = [];
  }
};
