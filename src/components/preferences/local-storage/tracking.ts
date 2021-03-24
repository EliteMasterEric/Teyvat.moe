/**
 * Handles listeners for local-storage.
 */

const listeners: { [key: string]: ListenerFn[] } = {};
const listening = false;

const change = (e: StorageEvent) => {
  if (!e) {
    // eslint-disable-next-line no-param-reassign
    if (global.event != null) {
      e = global.event as StorageEvent;
    }
  }
  if (e.key == null) return;

  const all = listeners[e.key];
  const fire = (listener: ListenerFn) => {
    listener(JSON.parse(e?.newValue ?? ''), JSON.parse(e?.oldValue ?? ''), e?.url ?? '');
  };
  if (all) {
    // Fire each listener.
    all.forEach(fire);
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
type ListenerFn = (newData: any, oldData: any, url: string) => void;
export const on = (key: string, fn: ListenerFn): void => {
  const ls = listeners[key];
  if (ls != null) {
    listeners[key] = [...ls, fn];
  } else {
    listeners[key] = [fn];
  }
  if (listening === false) {
    listen();
  }
};

export const off = (key: string, fn: ListenerFn): void => {
  const ns = listeners[key];
  if (ns != null && ns.length > 1) {
    ns.splice(ns.indexOf(fn), 1);
  } else {
    listeners[key] = [];
  }
};
