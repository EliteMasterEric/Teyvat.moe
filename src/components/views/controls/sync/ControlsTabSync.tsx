/**
 * Provides the interface for the Options tab of the map controls.
 */

import { makeStyles, Box, Button, Typography } from '@material-ui/core';
import clsx from 'clsx';
import dynamic from 'next/dynamic';
import React, { FunctionComponent } from 'react';
import { connect, ConnectedProps } from 'react-redux';

import { t } from 'src/components/i18n/Localization';
import BorderBox from 'src/components/interface/BorderBox';
import { TabView } from 'src/components/interface/Tabs';
import { exportDataJSON } from 'src/components/preferences/DataExport';
import { parseDataFromString } from 'src/components/preferences/DataImport';
import { importMarkerDataFromSite } from 'src/components/preferences/ExternalImport';
import { AppDispatch } from 'src/components/redux';
import { clearPreferences, setPreferences } from 'src/components/redux/Actions';
import { setImportError } from 'src/components/redux/slices/Error';
import { selectIsTabDisplayed } from 'src/components/redux/slices/Interface';
import { AppState } from 'src/components/redux/Types';
import { Empty } from 'src/components/Types';
import { isValidJSON } from 'src/components/util';
import ExportDataPopup from 'src/components/views/dialogs/ExportDataPopup';
import ImportDataPopup from 'src/components/views/dialogs/ImportDataPopup';

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
      'src/components/views/controls/sync/ControlsSyncGoogle'
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
  padBottom: {
    marginBottom: 8,
  },
  optionContainer: {
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'nowrap',
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
      const importedData = parseDataFromString(data);
      if (importedData == null) {
        return false;
      } else {
        dispatch(setPreferences(importedData));
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

  return (
    <TabView grow displayed={displayed}>
      <BorderBox grow={false} overflow="show" direction="column">
        <Typography className={clsx(classes.label, classes.padBottom)}>
          {t('sync-google-drive')}
        </Typography>
        <ControlsSyncGoogle />
      </BorderBox>
      <BorderBox grow={false} overflow="show" direction="column">
        <div className={classes.optionContainer}>
          <Typography className={classes.label}>{t('migrate-yuanshen')}</Typography>
          <ImportDataPopup
            title={t('migrate-yuanshen')}
            content={t('migrate-yuanshen-content')}
            contentSupports={t('migrate-yuanshen-support')}
            trigger={
              <Button className={classes.button} variant="contained" size="small">
                {t('migrate')}
              </Button>
            }
            onConfirm={(dataString: string) => importMarkerDataFromSite(dataString, 'yuanshen')}
          />
        </div>
        <div className={classes.optionContainer}>
          <Typography className={classes.label}>{t('migrate-appsample')}</Typography>
          <ImportDataPopup
            title={t('migrate-appsample')}
            content={t('migrate-appsample-content')}
            contentSupports={t('migrate-appsample-support')}
            bookmarklet={Bookmarklets.appsample}
            trigger={
              <Button className={classes.button} variant="contained" size="small">
                {t('migrate')}
              </Button>
            }
            onConfirm={(dataString: string) => importMarkerDataFromSite(dataString, 'appsample')}
          />
        </div>
        <div className={classes.optionContainer} style={{ display: 'none' }}>
          <Typography className={classes.label}>{t('migrate-mapgenie')}</Typography>
          <ImportDataPopup
            title={t('migrate-mapgenie')}
            content={t('migrate-mapgenie-content')}
            contentSupports={t('migrate-mapgenie-support')}
            bookmarklet={Bookmarklets.mapgenie}
            trigger={
              <Button className={classes.button} variant="contained" size="small">
                {t('migrate')}
              </Button>
            }
            onConfirm={(dataString: string) => importMarkerDataFromSite(dataString, 'mapgenie')}
          />
        </div>
      </BorderBox>
      <BorderBox grow={false} overflow="show" direction="column">
        <Box className={classes.optionContainer}>
          <Typography className={classes.label}>{t('import-data')}</Typography>
          <ImportDataPopup
            title={t('import-data')}
            content={t('import-data-content')}
            trigger={
              <Button className={classes.button} variant="contained" size="small">
                {t('import')}
              </Button>
            }
            onConfirm={(dataString: string) => importPreferences(dataString)}
          />
        </Box>
        <Box className={classes.optionContainer}>
          <Typography className={classes.label}>{t('export-data')}</Typography>
          <ExportDataPopup
            title={t('export-data')}
            message={t('export-data-content')}
            fetchData={exportDataJSON}
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
