/**
 * Code powering the popup displayed when clicking a feature.
 */

import React from 'react';
import clsx from 'clsx';

export const MapPopupAnchor = () => {
  return <span>Test</span>;
};

export const MapPopup = ({ marker, closePopup }) => {
  const { feature } = marker;

  const active = false;

  const toggleDone = () => {};

  console.log(marker);

  return (
    <div className={clsx('myPopContainer')}>
      <div className={clsx('myPopTitle')}>
        <div className={clsx('myPopName')}>myPopName</div>
      </div>
      <div className={clsx('myPopLine')}>myPopLine</div>
      <div
        className={clsx('myPopClose')}
        onClick={closePopup}
        onKeyDown={closePopup}
        role="button"
        aria-label="Hide Popup"
        tabIndex={0}
      >
        myPopClose
      </div>
      <div className={clsx('myPopPicture')}>myPopImage</div>
      <div
        role="checkbox"
        aria-checked={active}
        aria-label={active ? `Mark TO-DO` : `Mark DONE`}
        tabIndex={0}
        className={clsx(active ? 'switch-container-on' : 'switch-container-off')}
        onClick={toggleDone}
        onKeyDown={toggleDone}
      >
        <p className={clsx('switchOff')}>TO-DO</p>
        <p className={clsx('switchOn')}>DONE</p>
        <div className={clsx('switchButton')}>
          <div className={clsx('switchButtonIcon')}>
            <p>{active ? 'DONE' : 'TO-DO'}</p>
          </div>
        </div>
      </div>
      <div className={clsx('tipcard')} />
    </div>
  );
};
