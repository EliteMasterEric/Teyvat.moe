/* eslint-disable import/prefer-default-export */

export const canUseDOM = () => {
  return typeof window !== 'undefined' && window.document && window.document.createElement;
};
