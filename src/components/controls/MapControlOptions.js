import React from 'react';
import clsx from 'clsx';

import './MapControlOptions.css';
import ReactSwitch from 'react-switch';
import { resetLocalStorage } from '../Preferences';
import ClearMapDataPopup from '../popups/ClearMapDataPopup';

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
        <span className={clsx('map-controls-option-label')}>Clear Local Storage</span>
        <ClearMapDataPopup
          trigger={<button type="button">Clear</button>}
          onConfirm={resetLocalStorage}
        />
      </div>
    </div>
  );
};

export default MapControlOptions;
