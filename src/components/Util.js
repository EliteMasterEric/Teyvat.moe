import hash from 'object-hash';

export const canUseDOM = () => {
  return typeof window !== 'undefined' && window.document && window.document.createElement;
};

export const toBase64 = (input) => {
  return btoa(input);
};

export const fromBase64 = (input) => {
  return atob(input);
};

export const hashObject = (input) => hash(input);
