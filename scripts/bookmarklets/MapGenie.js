const copyToClipboard = (str) => {
  const el = document.createElement('textarea');
  el.value = str;
  document.body.appendChild(el);
  el.select();
  document.execCommand('copy');
  document.body.removeChild(el);
  alert('Copied data to clipboard.');
};

const getMapGenieData = () => {
  return Object.keys(window.store.getState().user.foundLocations);
};

copyToClipboard(getMapGenieData());
