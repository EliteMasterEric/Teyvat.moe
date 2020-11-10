import React from 'react';
import clsx from 'clsx';

import ReactSwitch from 'react-switch';
import ReactSlider from 'rc-slider';
import 'rc-slider/assets/index.css';
import { resetLocalStorage } from '../preferences/Preferences';
import { importDataFromString } from '../preferences/DataImport';
import { importLegacyDataFromString } from '../preferences/LegacyImport';
import ClearMapDataPopup from '../popups/ClearMapDataPopup';
import ExportDataPopup from '../popups/ExportDataPopup';
import ImportDataPopup from '../popups/ImportDataPopup';

import './MapControlOptions.css';
import { t } from '../Localization';
import { exportDataJSON } from '../preferences/DataExport';
import { exportLegacyDataJSON } from '../preferences/LegacyExport';

const MapControlOptions = ({ mapPreferences, setMapPreferences }) => {
  return (
    <>
      <div className={clsx('map-controls-options-container')}>
        <div className={clsx('map-controls-option')}>
          <span className={clsx('map-controls-option-label')}>{t('option-editor')}</span>
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
          <span className={clsx('map-controls-option-label')}>{t('option-completed-opacity')}</span>
          <ReactSlider
            className={clsx('map-controls-option-slider')}
            min={0.1}
            max={1}
            value={mapPreferences?.options?.completedAlpha}
            step={0.1}
            onChange={(completedAlpha) => {
              setMapPreferences((old) => ({
                ...old,
                options: {
                  ...old.options,
                  completedAlpha,
                },
              }));
            }}
          />
        </div>
        <div className={clsx('map-controls-option')}>
          <span className={clsx('map-controls-option-label')}>{t('option-cluster-markers')}</span>
          <ReactSwitch
            onChange={(clusterMarkers) => {
              setMapPreferences((old) => {
                return { ...old, options: { ...old.options, clusterMarkers } };
              });
            }}
            checked={mapPreferences?.options?.clusterMarkers}
          />
        </div>
      </div>
      <div className={clsx('map-controls-options-container')}>
        <div className={clsx('map-controls-option')}>
          <span className={clsx('map-controls-option-label')}>{t('option-import-new')}</span>
          <ImportDataPopup
            title={t('option-import-new')}
            content={t('popup-import-new-content')}
            trigger={<button type="button">{t('import')}</button>}
            onConfirm={(data) => importDataFromString(data, setMapPreferences)}
          />
        </div>
        <div className={clsx('map-controls-option')}>
          <span className={clsx('map-controls-option-label')}>{t('option-export-new')}</span>
          <ExportDataPopup
            title={t('option-export-new')}
            message={t('popup-export-new-content')}
            fetchData={exportDataJSON}
            trigger={<button type="button">{t('export')}</button>}
            onConfirm={resetLocalStorage}
          />
        </div>
        <div className={clsx('map-controls-option')}>
          <span className={clsx('map-controls-option-label')}>{t('option-clear-data')}</span>
          <ClearMapDataPopup
            trigger={<button type="button">{t('clear')}</button>}
            onConfirm={resetLocalStorage}
          />
        </div>
        <div className={clsx('map-controls-option')}>
          <span className={clsx('map-controls-option-label')}>{t('option-import-old')}</span>
          <ImportDataPopup
            title={t('option-import-old')}
            content={t('popup-import-old-content')}
            trigger={<button type="button">{t('import')}</button>}
            onConfirm={(data) => importLegacyDataFromString(data, setMapPreferences)}
          />
        </div>
        <div className={clsx('map-controls-option')}>
          <span className={clsx('map-controls-option-label')}>{t('option-export-old')}</span>
          <ExportDataPopup
            title={t('option-export-old')}
            message={t('popup-export-old-content')}
            fetchData={exportLegacyDataJSON}
            trigger={<button type="button">{t('export')}</button>}
            onConfirm={resetLocalStorage}
          />
        </div>
      </div>
    </>
  );
};

export default MapControlOptions;
