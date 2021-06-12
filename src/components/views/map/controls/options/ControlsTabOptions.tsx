/**
 * Provides the interface for the Options tab of the map controls.
 */

import { makeStyles, Box, Button, Switch, Typography } from '@material-ui/core';
import clsx from 'clsx';
import React, { FunctionComponent, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { LocalizedTypography, t } from 'src/components/i18n/Localization';
import BorderBox from 'src/components/interface/BorderBox';
import { InputSlider } from 'src/components/interface/Input';
import { TabView } from 'src/components/interface/Tabs';
import { clearPreferences } from 'src/components/redux/slices/common/core/Actions';
import {
  setEditorDebugEnabled,
  setEditorEnabled,
} from 'src/components/redux/slices/map/interface/Actions';
import {
  selectEditorDebugEnabled,
  selectEditorEnabled,
  selectIsTabDisplayed,
} from 'src/components/redux/slices/map/interface/Selector';
import {
  setClusterMarkers,
  setCompletedAlpha,
  setHideFeaturesInEditor,
  setHideRoutesInEditor,
  setRegionLabelsEnabled,
  setShowHiddenFeaturesInSummary,
  setWorldBorderEnabled,
} from 'src/components/redux/slices/map/options/Actions';
import {
  selectClusterMarkers,
  selectCompletedAlpha,
  selectHideFeaturesInEditor,
  selectHideRoutesInEditor,
  selectRegionLabelsEnabled,
  selectShowHiddenFeaturesInSummary,
  selectWorldBorderEnabled,
} from 'src/components/redux/slices/map/options/Selector';
import { AppState } from 'src/components/redux/Types';

import { getApplicationVersion } from 'src/components/util';
import ControlsOptionsLanguage from 'src/components/views/map/controls/options/ControlsOptionsLanguage';
import ClearMapDataPopup from 'src/components/views/map/dialogs/ClearMapDataPopup';

const useStyles = makeStyles((_theme) => ({
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
  versionLabel: {
    textAlign: 'center',
  },
}));

const isOptionsDisplayed = (state: AppState) => selectIsTabDisplayed(state, 'options');

const ControlsTabOptions: FunctionComponent = () => {
  const classes = useStyles();

  const dispatch = useDispatch();

  const displayed = useSelector(isOptionsDisplayed);
  const editorEnabled = useSelector(selectEditorEnabled);
  const hideFeaturesInEditor = useSelector(selectHideFeaturesInEditor);
  const hideRoutesInEditor = useSelector(selectHideRoutesInEditor);
  const completedAlpha = useSelector(selectCompletedAlpha);
  const clusterMarkers = useSelector(selectClusterMarkers);
  const worldBorderEnabled = useSelector(selectWorldBorderEnabled);
  const regionLabelsEnabled = useSelector(selectRegionLabelsEnabled);
  const showHiddenFeaturesInSummary = useSelector(selectShowHiddenFeaturesInSummary);
  const editorDebugEnabled = useSelector(selectEditorDebugEnabled);

  const changeEditorEnabled = useCallback(
    (_event, value) => dispatch(setEditorEnabled(value)),
    [setEditorEnabled]
  );
  const changeCompletedAlpha = useCallback(
    (value) => dispatch(setCompletedAlpha(value)),
    [setCompletedAlpha]
  );
  const changeWorldBorderEnabled = useCallback(
    (_event, value) => dispatch(setWorldBorderEnabled(value)),
    [setWorldBorderEnabled]
  );
  const changeRegionLabelsEnabled = useCallback(
    (_event, value) => dispatch(setRegionLabelsEnabled(value)),
    []
  );
  const changeClusterMarkers = useCallback(
    (_event, value) => dispatch(setClusterMarkers(value)),
    []
  );
  const changeHideFeaturesInEditor = useCallback(
    (_event, value) => dispatch(setHideFeaturesInEditor(value)),
    []
  );
  const changeHideRoutesInEditor = useCallback(
    (_event, value) => dispatch(setHideRoutesInEditor(value)),
    []
  );
  const changeShowHiddenFeaturesInSummary = useCallback(
    (_event, value) => dispatch(setShowHiddenFeaturesInSummary(value)),
    []
  );
  const changeEditorDebugEnabled = useCallback(
    (_event, value) => dispatch(setEditorDebugEnabled(value)),
    []
  );
  const triggerClearPreferences = useCallback(() => dispatch(clearPreferences()), []);

  const formatValueLabel = useCallback((value) => `${Math.round(value * 100)}%`, []);

  return (
    <TabView grow displayed={displayed}>
      <LocalizedTypography
        variant="subtitle2"
        className={classes.versionLabel}
        i18nKey="version-format"
        values={{ version: getApplicationVersion() }}
      />
      <ControlsOptionsLanguage />
      <BorderBox direction="column" overflow="show" grow={false}>
        <Box className={classes.optionContainer}>
          <LocalizedTypography className={classes.label} i18nKey="map-ui:options-editor-enable" />
          <Switch
            size="small"
            color="primary"
            onChange={changeEditorEnabled}
            checked={editorEnabled}
          />
        </Box>
        <Box className={classes.optionContainer}>
          <LocalizedTypography
            className={classes.label}
            i18nKey="map-ui:options-editor-hide-features"
          />
          <Switch
            size="small"
            color="primary"
            onChange={changeHideFeaturesInEditor}
            checked={hideFeaturesInEditor}
          />
        </Box>
        <Box className={classes.optionContainer}>
          <LocalizedTypography
            className={classes.label}
            i18nKey="map-ui:options-editor-hide-routes"
          />
          <Switch
            size="small"
            color="primary"
            onChange={changeHideRoutesInEditor}
            checked={hideRoutesInEditor}
          />
        </Box>
      </BorderBox>
      <BorderBox direction="column" overflow="show" grow={false}>
        <Box className={classes.optionContainer}>
          <LocalizedTypography
            className={classes.label}
            i18nKey="map-ui:options-completed-opacity"
          />
          <InputSlider
            value={completedAlpha}
            min={0.1}
            max={1}
            step={0.1}
            onChange={changeCompletedAlpha}
            valueLabelDisplay="auto"
            valueLabelFormat={formatValueLabel}
          />
        </Box>
        <Box className={classes.optionContainer}>
          <LocalizedTypography className={classes.label} i18nKey="map-ui:options-cluster-markers" />
          <Switch
            size="small"
            color="primary"
            onChange={changeClusterMarkers}
            checked={clusterMarkers}
          />
        </Box>
        {/*
        <Box className={classes.optionContainer}>
          <LocalizedTypography className={classes.label} i18nKey="map-ui:options-world-border" />
          <Switch
            size="small"
            color="primary"
            onChange={changeWorldBorderEnabled}
            checked={worldBorderEnabled}
          />
        </Box>
        */}
        <Box className={classes.optionContainer}>
          <LocalizedTypography className={classes.label} i18nKey="map-ui:options-region-labels" />
          <Switch
            size="small"
            color="primary"
            onChange={changeRegionLabelsEnabled}
            checked={regionLabelsEnabled}
          />
        </Box>
        <Box className={classes.optionContainer}>
          <Typography className={clsx(classes.label, classes.labelLong)}>
            {t('map-ui:options-show-hidden-features')}
          </Typography>
          <Switch
            size="small"
            color="primary"
            onChange={changeShowHiddenFeaturesInSummary}
            checked={showHiddenFeaturesInSummary}
          />
        </Box>
        <Box className={classes.optionContainer}>
          <LocalizedTypography className={classes.label} i18nKey="map-ui:options-display-debug" />
          <Switch
            size="small"
            color="primary"
            onChange={changeEditorDebugEnabled}
            checked={editorDebugEnabled}
          />
        </Box>
      </BorderBox>
      <BorderBox direction="column" overflow="show" grow={false}>
        <Box className={classes.optionContainer}>
          <Typography className={clsx(classes.label, classes.labelWarning)}>
            {t('map-ui:options-clear-data')}
          </Typography>
          <ClearMapDataPopup
            trigger={
              <Button className={classes.button} variant="contained" size="small">
                {t('clear')}
              </Button>
            }
            onConfirm={triggerClearPreferences}
          />
        </Box>
      </BorderBox>
    </TabView>
  );
};

export default ControlsTabOptions;
