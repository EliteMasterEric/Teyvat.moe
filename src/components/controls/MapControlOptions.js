import React from 'react';
import clsx from 'clsx';

import './MapControlOptions.css';
import ReactSwitch from 'react-switch';
import { resetLocalStorage } from '../Preferences';

const MapControlOptions = ({ mapPreferences, setMapPreferences }) => {
  return (
    <div className={clsx('map-controls-options-container')}>
      <div className={clsx('map-controls-option')}>
        <span className={clsx('map-controls-option-label')}>Enable Editor</span>
        <ReactSwitch
          onChange={(enabled) => {
            setMapPreferences((old) => {
              return { ...old, editor: { ...old.editor, enabled } };
            });
          }}
          checked={mapPreferences?.editor?.enabled}
        />
      </div>
      <div className={clsx('map-controls-option')}>
        <span className={clsx('map-controls-option-label')}>Clear Data</span>
        <button type="button" onClick={() => resetLocalStorage()}>
          Clear
        </button>
      </div>
    </div>
  );
};

export default MapControlOptions;
