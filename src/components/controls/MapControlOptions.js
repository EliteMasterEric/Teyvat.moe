import React from 'react';
import clsx from 'clsx';

import './MapControlOptions.css';
import ReactSwitch from 'react-switch';
import { resetLocalStorage, exportDataJSON, exportLegacyDataJSON } from '../Preferences';
import ClearMapDataPopup from '../popups/ClearMapDataPopup';
import ExportDataPopup from '../popups/ExportDataPopup';

const MapControlOptions = ({ mapPreferences, setMapPreferences }) => {
  return (
    <>
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
      </div>
      <div className={clsx('map-controls-options-container')}>
        <div className={clsx('map-controls-option')}>
          <span className={clsx('map-controls-option-label')}>Export Data</span>
          <ExportDataPopup
            title="Export Data"
            message="Below is exported data for the new version of GenshinMap."
            fetchData={exportDataJSON}
            trigger={<button type="button">Export</button>}
            onConfirm={resetLocalStorage}
          />
        </div>
        <div className={clsx('map-controls-option')}>
          <span className={clsx('map-controls-option-label')}>Clear Data</span>
          <ClearMapDataPopup
            trigger={<button type="button">Clear</button>}
            onConfirm={resetLocalStorage}
          />
        </div>
        <div className={clsx('map-controls-option')}>
          <span className={clsx('map-controls-option-label')}>Export Legacy Data</span>
          <ExportDataPopup
            title="Export Legacy Data"
            message="Below is exported data for the old version of GenshinMap, compatible with other sites.."
            fetchData={exportLegacyDataJSON}
            trigger={<button type="button">Export</button>}
            onConfirm={resetLocalStorage}
          />
        </div>
      </div>
    </>
  );
};

export default MapControlOptions;
