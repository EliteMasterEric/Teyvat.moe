/**
 * Provides the interface for the Options tab of the map controls.
 */

import { Box, Button } from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';
import dynamic from 'next/dynamic';
import React, { FunctionComponent, useCallback } from 'react';
import { connect, ConnectedProps } from 'react-redux';

import { t, LocalizedTypography } from 'src/components/i18n/Localization';
import BifrostMigrator from 'src/components/interface/BifrostMigrator';
import BorderBox from 'src/components/interface/BorderBox';
import { TabView } from 'src/components/interface/Tabs';
import { exportMapDataJSON } from 'src/components/preferences/map/DataExport';
import { parseMapDataFromString } from 'src/components/preferences/map/DataImport';
import { importMarkerDataFromSite } from 'src/components/preferences/map/ExternalImport';
import { AppDispatch, store } from 'src/components/redux';
import { clearPreferences, setPreferences } from 'src/components/redux/slices/common/core/Actions';
import { selectNamespaceMap } from 'src/components/redux/slices/map';
import { setImportError } from 'src/components/redux/slices/map/error/Actions';
import { selectIsTabDisplayed } from 'src/components/redux/slices/map/interface/Selector';
import { AppState } from 'src/components/redux/Types';
import { Empty } from 'src/components/Types';
import { isValidJSON } from 'src/components/util';
import ExportDataPopup from 'src/components/views/map/dialogs/ExportDataPopup';
import ImportDataPopup from 'src/components/views/map/dialogs/ImportDataPopup';

import Bookmarklets from 'src/data/core/bookmarklets.json';

/**
 * Since the GAPI requires a window element,
 * ensure all Google sync functionality is only loaded on the client.
 */
const ControlsSyncGoogle = dynamic(
  () =>
    import(
      /* webpackChunkName: "gm-auth-google" */
      /* webpackMode: "lazy" */
      'src/components/views/map/controls/sync/ControlsSyncGoogle'
    ),
  { ssr: false }
);

const useStyles = makeStyles((_theme) => ({
  label: {
    flexGrow: 1,
  },
  button: {
    width: 140,
  },
  optionContainer: {
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'nowrap',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
}));
const mapStateToProps = (state: AppState) => ({
  displayed: selectIsTabDisplayed(state, 'sync'),
});
const mapDispatchToProps = (dispatch: AppDispatch) => ({
  importPreferences: (data: string) => {
    try {
      const importedData = parseMapDataFromString(data);
      if (importedData == null) {
        return false;
      } else {
        setPreferences({
          map: {
            ...selectNamespaceMap(store.getState()),
            ...importedData,
          },
        });
        return true;
      }
    } catch (error) {
      switch (error.name) {
        case 'InvalidCharacterError':
          if (isValidJSON(data)) {
            dispatch(setImportError(t('message-import-error-malformed-json')));
          } else {
            dispatch(setImportError(t('message-import-error-malformed-not-json')));
          }
          break;
        default:
          console.error(error);
          console.error(error.name);
          dispatch(setImportError(t('message-import-error-generic')));
      }
      return false;
    }
  },

  clearState: () => dispatch(clearPreferences()),
});
type ControlsTabSyncStateProps = ReturnType<typeof mapStateToProps>;
type ControlsTabSyncDispatchProps = ReturnType<typeof mapDispatchToProps>;
const connector = connect<ControlsTabSyncStateProps, ControlsTabSyncDispatchProps, Empty, AppState>(
  mapStateToProps,
  mapDispatchToProps
);

type ControlsTabSyncProps = ConnectedProps<typeof connector>;

const _ControlsTabSync: FunctionComponent<ControlsTabSyncProps> = ({
  displayed,

  importPreferences,
}) => {
  const classes = useStyles();

  const onMigrateYuanshen = useCallback(
    (dataString: string) => importMarkerDataFromSite(dataString, 'yuanshen'),
    []
  );
  const onMigrateAppSample = useCallback(
    (dataString: string) => importMarkerDataFromSite(dataString, 'appsample'),
    []
  );
  const onMigrateMapGenie = useCallback(
    (dataString: string) => importMarkerDataFromSite(dataString, 'mapgenie'),
    []
  );

  return (
    <TabView grow displayed={displayed}>
      <BorderBox grow={false} overflow="show" direction="column">
        <ControlsSyncGoogle />
      </BorderBox>
      <BorderBox grow={false} overflow="show" direction="column">
        <div className={classes.optionContainer}>
          <LocalizedTypography className={classes.label} i18nKey="map-ui:migrate-yuanshen" />
          <ImportDataPopup
            title={t('map-ui:migrate-yuanshen')}
            content={t('map-ui:migrate-yuanshen-content')}
            contentSupports={t('map-ui:migrate-yuanshen-support')}
            externalLink="https://yuanshen.site/backfall.html"
            trigger={
              <Button className={classes.button} variant="contained" size="small">
                {t('migrate')}
              </Button>
            }
            onConfirm={onMigrateYuanshen}
          />
        </div>
        <div className={classes.optionContainer}>
          <LocalizedTypography className={classes.label} i18nKey="map-ui:migrate-appsample" />
          <ImportDataPopup
            title={t('map-ui:migrate-appsample')}
            content={t('map-ui:migrate-appsample-content')}
            contentSupports={t('map-ui:migrate-appsample-support')}
            bookmarklet={Bookmarklets.appsample}
            trigger={
              <Button className={classes.button} variant="contained" size="small">
                {t('migrate')}
              </Button>
            }
            onConfirm={onMigrateAppSample}
          />
        </div>
        {/* TODO: Add enough MapGenie marker support to enable this. */}
        <div className={classes.optionContainer} style={{ display: 'none' }}>
          <LocalizedTypography className={classes.label} i18nKey="map-ui:migrate-mapgenie" />
          <ImportDataPopup
            title={t('map-ui:migrate-mapgenie')}
            content={t('map-ui:migrate-mapgenie-content')}
            contentSupports={t('map-ui:migrate-mapgenie-support')}
            bookmarklet={Bookmarklets.mapgenie}
            trigger={
              <Button className={classes.button} variant="contained" size="small">
                {t('migrate')}
              </Button>
            }
            onConfirm={onMigrateMapGenie}
          />
        </div>
      </BorderBox>
      <BorderBox grow={false} overflow="show" direction="column">
        <BifrostMigrator />
      </BorderBox>
      <BorderBox grow={false} overflow="show" direction="column">
        <Box className={classes.optionContainer}>
          <LocalizedTypography className={classes.label} i18nKey="import-data" />
          <ImportDataPopup
            title={t('import-data')}
            content={t('map-ui:import-data-content')}
            trigger={
              <Button className={classes.button} variant="contained" size="small">
                {t('import')}
              </Button>
            }
            onConfirm={importPreferences}
          />
        </Box>
        <Box className={classes.optionContainer}>
          <LocalizedTypography className={classes.label} i18nKey="export-data" />
          <ExportDataPopup
            title={t('export-data')}
            message={t('map-ui:export-data-content')}
            fetchData={exportMapDataJSON}
            trigger={
              <Button className={classes.button} variant="contained" size="small">
                {t('export')}
              </Button>
            }
          />
        </Box>
      </BorderBox>
    </TabView>
  );
};

const ControlsTabSync = connector(_ControlsTabSync);

export default ControlsTabSync;
