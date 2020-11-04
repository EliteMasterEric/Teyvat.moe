/**
 * Handles listeners for local-storage.
 */

const listeners = {};
const listening = false;

function change(e) {
  if (!e) {
    // eslint-disable-next-line no-param-reassign
    e = global.event;
  }
  const all = listeners[e.key];
  const fire = (listener) => {
    listener(JSON.parse(e.newValue), JSON.parse(e.oldValue), e.url || e.uri);
  };
  if (all) {
    // Fire each listener.
    all.forEach(fire);
  }
}

function listen() {
  if (global.addEventListener) {
    global.addEventListener('storage', change, false);
  } else if (global.attachEvent) {
    global.attachEvent('onstorage', change);
  } else {
    global.onstorage = change;
  }
}

/**
 * Attaches an event listener that is triggered when the key changes.
 * @param {*} key The local storage key.
 * @param {*} fn A function that takes (newData, oldData, url)
 */
export const on = (key, fn) => {
  if (listeners[key]) {
    listeners[key].push(fn);
  } else {
    listeners[key] = [fn];
  }
  if (listening === false) {
    listen();
  }
};

export const off = (key, fn) => {
  const ns = listeners[key];
  if (ns.length > 1) {
    ns.splice(ns.indexOf(fn), 1);
  } else {
    listeners[key] = [];
  }
};
