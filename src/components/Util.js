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

export const generatePrettyJSON = (input) => {
  return JSON.stringify(input, null, 2);
};

export const openURLInWindow = (url) => {
  if (window == null) return;

  const win = window.open(url, '_blank');
  if (win != null) {
    win.focus();
  }
};
