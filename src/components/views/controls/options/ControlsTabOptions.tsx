/**
 * Provides the interface for the Options tab of the map controls.
 */

import { makeStyles, Box, Button, Switch, Typography } from '@material-ui/core';
import clsx from 'clsx';
import React, { FunctionComponent } from 'react';
import { connect, ConnectedProps } from 'react-redux';

import { f, t } from 'src/components/i18n/Localization';
import BorderBox from 'src/components/interface/BorderBox';
import { InputSlider } from 'src/components/interface/Input';
import { TabView } from 'src/components/interface/Tabs';
import { AppDispatch } from 'src/components/redux';
import { clearPreferences } from 'src/components/redux/actions';
import {
  selectClusterMarkers,
  selectCompletedAlpha,
  selectHideFeaturesInEditor,
  selectHideRoutesInEditor,
  selectRegionLabelsEnabled,
  selectShowHiddenFeaturesInSummary,
  selectWorldBorderEnabled,
  setClusterMarkers,
  setCompletedAlpha,
  setHideFeaturesInEditor,
  setHideRoutesInEditor,
  setOverrideLang,
  setRegionLabelsEnabled,
  setShowHiddenFeaturesInSummary,
  setWorldBorderEnabled,
} from 'src/components/redux/slices/options';
import {
  selectEditorDebugEnabled,
  selectEditorEnabled,
  selectIsTabDisplayed,
  setEditorDebugEnabled,
  setEditorEnabled,
} from 'src/components/redux/slices/ui';
import { AppState } from 'src/components/redux/types';
import { Empty } from 'src/components/Types';
import { getApplicationVersion } from 'src/components/util';
import ControlsOptionsLanguage from 'src/components/views/controls/options/ControlsOptionsLanguage';
import ClearMapDataPopup from 'src/components/views/dialogs/ClearMapDataPopup';

const useStyles = makeStyles((_theme) => ({
  subtitle: {
    fontSize: 12,
    textAlign: 'center',
    marginBottom: 8,
    fontStyle: 'italic',
  },
  label: {
    flexGrow: 1,
  },
  labelWarning: {
    color: 'darkred',
  },
  labelLong: {
    margin: '0 24px 0 0',
  },
  button: {
    width: 140,
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
  displayed: selectIsTabDisplayed(state, 'options'),

  editorEnabled: selectEditorEnabled(state),
  completedAlpha: selectCompletedAlpha(state),
  worldBorderEnabled: selectWorldBorderEnabled(state),
  regionLabelsEnabled: selectRegionLabelsEnabled(state),
  clusterMarkers: selectClusterMarkers(state),
  hideFeaturesInEditor: selectHideFeaturesInEditor(state),
  hideRoutesInEditor: selectHideRoutesInEditor(state),
  showHiddenFeaturesInSummary: selectShowHiddenFeaturesInSummary(state),
  editorDebugEnabled: selectEditorDebugEnabled(state),
});
const mapDispatchToProps = (dispatch: AppDispatch) => ({
  setEditorEnabled: (enabled: boolean) => dispatch(setEditorEnabled(enabled)),
  setCompletedAlpha: (alpha: number) => dispatch(setCompletedAlpha(alpha)),
  setWorldBorderEnabled: (enabled: boolean) => dispatch(setWorldBorderEnabled(enabled)),
  setRegionLabelsEnabled: (enabled: boolean) => dispatch(setRegionLabelsEnabled(enabled)),
  setClusterMarkers: (enabled: boolean) => dispatch(setClusterMarkers(enabled)),
  setHideFeaturesInEditor: (enabled: boolean) => dispatch(setHideFeaturesInEditor(enabled)),
  setHideRoutesInEditor: (enabled: boolean) => dispatch(setHideRoutesInEditor(enabled)),
  setShowHiddenFeaturesInSummary: (enabled: boolean) =>
    dispatch(setShowHiddenFeaturesInSummary(enabled)),
  setEditorDebugEnabled: (enabled: boolean) => dispatch(setEditorDebugEnabled(enabled)),
  setOverrideLang: (lang: string) => dispatch(setOverrideLang(lang)),

  clearState: () => dispatch(clearPreferences()),
});
type ControlsTabOptionsStateProps = ReturnType<typeof mapStateToProps>;
type ControlsTabOptionsDispatchProps = ReturnType<typeof mapDispatchToProps>;
const connector = connect<
  ControlsTabOptionsStateProps,
  ControlsTabOptionsDispatchProps,
  Empty,
  AppState
>(mapStateToProps, mapDispatchToProps);

type ControlsTabOptionsProps = ConnectedProps<typeof connector>;

const _ControlsTabOptions: FunctionComponent<ControlsTabOptionsProps> = ({
  displayed,

  editorEnabled,
  hideFeaturesInEditor,
  hideRoutesInEditor,
  completedAlpha,
  clusterMarkers,
  worldBorderEnabled,
  regionLabelsEnabled,
  showHiddenFeaturesInSummary,
  editorDebugEnabled,

  setEditorEnabled,
  setHideFeaturesInEditor,
  setHideRoutesInEditor,
  setCompletedAlpha,
  setClusterMarkers,
  setWorldBorderEnabled,
  setRegionLabelsEnabled,
  setShowHiddenFeaturesInSummary,
  setEditorDebugEnabled,

  clearState,
}) => {
  const classes = useStyles();

  return (
    <TabView grow displayed={displayed}>
      <Typography className={classes.subtitle}>
        {f('version-format', { version: getApplicationVersion() })}
      </Typography>
      <ControlsOptionsLanguage />
      <BorderBox overflow="show">
        <Box className={classes.optionContainer}>
          <Typography className={classes.label}>{t('options-editor-enable')}</Typography>
          <Switch
            size="small"
            color="primary"
            onChange={(event) => setEditorEnabled(event.target.checked)}
            checked={editorEnabled}
          />
        </Box>
        <Box className={classes.optionContainer}>
          <Typography className={classes.label}>{t('options-editor-hide-features')}</Typography>
          <Switch
            size="small"
            color="primary"
            onChange={(event) => setHideFeaturesInEditor(event.target.checked)}
            checked={hideFeaturesInEditor}
          />
        </Box>
        <Box className={classes.optionContainer}>
          <Typography className={classes.label}>{t('options-editor-hide-routes')}</Typography>
          <Switch
            size="small"
            color="primary"
            onChange={(event) => setHideRoutesInEditor(event.target.checked)}
            checked={hideRoutesInEditor}
          />
        </Box>
      </BorderBox>
      <BorderBox overflow="show">
        <Box className={classes.optionContainer}>
          <Typography className={classes.label}>{t('options-completed-opacity')}</Typography>
          <InputSlider
            value={completedAlpha}
            min={0.1}
            max={1}
            step={0.1}
            onChange={(newValue: number) => setCompletedAlpha(newValue)}
            valueLabelDisplay="auto"
            valueLabelFormat={(value) => `${Math.round(value * 100)}%`}
          />
        </Box>
        <Box className={classes.optionContainer}>
          <Typography className={classes.label}>{t('options-cluster-markers')}</Typography>
          <Switch
            size="small"
            color="primary"
            onChange={(event) => setClusterMarkers(event.target.checked)}
            checked={clusterMarkers}
          />
        </Box>
        <Box className={classes.optionContainer}>
          <Typography className={classes.label}>{t('options-world-border')}</Typography>
          <Switch
            size="small"
            color="primary"
            onChange={(event) => setWorldBorderEnabled(event.target.checked)}
            checked={worldBorderEnabled}
          />
        </Box>
        <Box className={classes.optionContainer}>
          <Typography className={classes.label}>{t('options-region-labels')}</Typography>
          <Switch
            size="small"
            color="primary"
            onChange={(event) => setRegionLabelsEnabled(event.target.checked)}
            checked={regionLabelsEnabled}
          />
        </Box>
        <Box className={classes.optionContainer}>
          <Typography className={clsx(classes.label, classes.labelLong)}>
            {t('options-show-hidden-features')}
          </Typography>
          <Switch
            size="small"
            color="primary"
            onChange={(event) => setShowHiddenFeaturesInSummary(event.target.checked)}
            checked={showHiddenFeaturesInSummary}
          />
        </Box>
        <Box className={classes.optionContainer}>
          <Typography className={classes.label}>{t('options-display-debug')}</Typography>
          <Switch
            size="small"
            color="primary"
            onChange={(event) => setEditorDebugEnabled(event.target.checked)}
            checked={editorDebugEnabled}
          />
        </Box>
      </BorderBox>
      <BorderBox overflow="show">
        <Box className={classes.optionContainer}>
          <Typography className={clsx(classes.label, classes.labelWarning)}>
            {t('options-clear-data')}
          </Typography>
          <ClearMapDataPopup
            trigger={
              <Button className={classes.button} variant="contained" size="small">
                {t('clear')}
              </Button>
            }
            onConfirm={clearState}
          />
        </Box>
      </BorderBox>
    </TabView>
  );
};

const ControlsTabOptions = connector(_ControlsTabOptions);

export default ControlsTabOptions;
