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
import { useImageExtension } from '../Image';

const MapControlOptions = ({ mapPreferences, setMapPreferences }) => {
  const ext = useImageExtension();

  return (
    <>
      <div
        className={clsx('map-controls-options-container', `map-controls-options-container-${ext}`)}
      >
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
        <div className={clsx('map-controls-option')}>
          <span className={clsx('map-controls-option-label')}>
            {t('option-editor-hide-features')}
          </span>
          <ReactSwitch
            onChange={(hideFeaturesInEditor) => {
              setMapPreferences((old) => {
                return { ...old, options: { ...old.options, hideFeaturesInEditor } };
              });
            }}
            checked={mapPreferences?.options?.hideFeaturesInEditor}
          />
        </div>
        <div className={clsx('map-controls-option')}>
          <span className={clsx('map-controls-option-label')}>
            {t('option-editor-hide-routes')}
          </span>
          <ReactSwitch
            onChange={(hideRoutesInEditor) => {
              setMapPreferences((old) => {
                return { ...old, options: { ...old.options, hideRoutesInEditor } };
              });
            }}
            checked={mapPreferences?.options?.hideRoutesInEditor}
          />
        </div>
      </div>
      <div
        className={clsx('map-controls-options-container', `map-controls-options-container-${ext}`)}
      >
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
            checked={mapPreferences?.options?.clusterMarkers ?? true}
          />
        </div>
        <div className={clsx('map-controls-option')}>
          <span className={clsx('map-controls-option-label')}>{t('option-world-border')}</span>
          <ReactSwitch
            onChange={(worldBorderEnabled) => {
              setMapPreferences((old) => {
                return { ...old, options: { ...old.options, worldBorderEnabled } };
              });
            }}
            checked={mapPreferences?.options?.worldBorderEnabled ?? true}
          />
        </div>
        <div className={clsx('map-controls-option')}>
          <span className={clsx('map-controls-option-label')}>{t('option-region-labels')}</span>
          <ReactSwitch
            onChange={(regionLabelsEnabled) => {
              setMapPreferences((old) => {
                return { ...old, options: { ...old.options, regionLabelsEnabled } };
              });
            }}
            checked={mapPreferences?.options?.regionLabelsEnabled ?? true}
          />
        </div>
      </div>
      <div
        className={clsx('map-controls-options-container', `map-controls-options-container-${ext}`)}
      >
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
