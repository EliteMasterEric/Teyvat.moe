/**
 * Provides the interface for the Options tab of the map controls.
 */

import { Box, Button, Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';
import clsx from 'clsx';
import React, { FunctionComponent, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { LocalizedTypography, t } from 'src/components/i18n/Localization';
import BorderBox from 'src/components/interface/BorderBox';
import { InputSlider, InputSwitch } from 'src/components/interface/Input';
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

  const changeCompletedAlpha = useCallback(
    (value) => dispatch(setCompletedAlpha(value)),
    [setCompletedAlpha]
  );
  const changeRegionLabelsEnabled = useCallback(
    (_event, value) => dispatch(setRegionLabelsEnabled(value)),
    []
  );
  const changeClusterMarkers = useCallback(
    (_event, value) => dispatch(setClusterMarkers(value)),
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
          <InputSwitch
            size="small"
            color="primary"
            debounce={100}
            value={editorEnabled}
            onChange={(value: boolean) => dispatch(setEditorEnabled(value))}
          />
        </Box>
        <Box className={classes.optionContainer}>
          <LocalizedTypography
            className={classes.label}
            i18nKey="map-ui:options-editor-hide-features"
          />
          <InputSwitch
            size="small"
            color="primary"
            debounce={100}
            value={hideFeaturesInEditor}
            onChange={(value: boolean) => dispatch(setHideFeaturesInEditor(value))}
          />
        </Box>
        <Box className={classes.optionContainer}>
          <LocalizedTypography
            className={classes.label}
            i18nKey="map-ui:options-editor-hide-routes"
          />
          <InputSwitch
            size="small"
            color="primary"
            debounce={100}
            value={hideRoutesInEditor}
            onChange={(value: boolean) => dispatch(setHideRoutesInEditor(value))}
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
          <InputSwitch
            size="small"
            color="primary"
            debounce={100}
            value={clusterMarkers}
            onChange={(value: boolean) => dispatch(setClusterMarkers(value))}
          />
        </Box>
        {/*
        <Box className={classes.optionContainer}>
          <LocalizedTypography className={classes.label} i18nKey="map-ui:options-world-border" />
          <InputSwitch
            size="small"
            color="primary"
            debounce={100}
            value={worldBorderEnabled}
            onChange={(value: boolean) => dispatch(setWorldBorderEnabled(value))}
          />
        </Box>
        */}
        <Box className={classes.optionContainer}>
          <LocalizedTypography className={classes.label} i18nKey="map-ui:options-region-labels" />
          <InputSwitch
            size="small"
            color="primary"
            debounce={100}
            value={regionLabelsEnabled}
            onChange={(value: boolean) => dispatch(setRegionLabelsEnabled(value))}
          />
        </Box>
        <Box className={classes.optionContainer}>
          <Typography className={clsx(classes.label, classes.labelLong)}>
            {t('map-ui:options-show-hidden-features')}
          </Typography>
          <InputSwitch
            size="small"
            color="primary"
            debounce={100}
            value={showHiddenFeaturesInSummary}
            onChange={(value: boolean) => dispatch(setShowHiddenFeaturesInSummary(value))}
          />
        </Box>
        <Box className={classes.optionContainer}>
          <LocalizedTypography className={classes.label} i18nKey="map-ui:options-display-debug" />
          <InputSwitch
            size="small"
            color="primary"
            debounce={100}
            value={editorDebugEnabled}
            onChange={(value: boolean) => dispatch(setEditorDebugEnabled(value))}
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
