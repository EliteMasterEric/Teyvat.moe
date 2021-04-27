/**
 * Provides the interface for the Options tab of the map controls.
 */

import { makeStyles, Box, Button, Switch, Typography } from '@material-ui/core';
import clsx from 'clsx';
import React, { FunctionComponent } from 'react';
import { connect, ConnectedProps } from 'react-redux';

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
  setOverrideLang,
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
import { Empty } from 'src/components/Types';
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
const mapDispatchToProps = {
  setEditorEnabled,
  setCompletedAlpha,
  setWorldBorderEnabled,
  setRegionLabelsEnabled,
  setClusterMarkers,
  setHideFeaturesInEditor,
  setHideRoutesInEditor,
  setShowHiddenFeaturesInSummary,
  setEditorDebugEnabled,
  setOverrideLang,
  clearPreferences,
};
type ControlsTabOptionsStateProps = ReturnType<typeof mapStateToProps>;
type ControlsTabOptionsDispatchProps = typeof mapDispatchToProps;
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

  clearPreferences,
}) => {
  const classes = useStyles();

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
            onChange={(event) => setEditorEnabled(event.target.checked)}
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
            onChange={(event) => setHideFeaturesInEditor(event.target.checked)}
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
            onChange={(event) => setHideRoutesInEditor(event.target.checked)}
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
            onChange={(newValue: number) => setCompletedAlpha(newValue)}
            valueLabelDisplay="auto"
            valueLabelFormat={(value) => `${Math.round(value * 100)}%`}
          />
        </Box>
        <Box className={classes.optionContainer}>
          <LocalizedTypography className={classes.label} i18nKey="map-ui:options-cluster-markers" />
          <Switch
            size="small"
            color="primary"
            onChange={(event) => setClusterMarkers(event.target.checked)}
            checked={clusterMarkers}
          />
        </Box>
        <Box className={classes.optionContainer}>
          <LocalizedTypography className={classes.label} i18nKey="map-ui:options-world-border" />
          <Switch
            size="small"
            color="primary"
            onChange={(event) => setWorldBorderEnabled(event.target.checked)}
            checked={worldBorderEnabled}
          />
        </Box>
        <Box className={classes.optionContainer}>
          <LocalizedTypography className={classes.label} i18nKey="map-ui:options-region-labels" />
          <Switch
            size="small"
            color="primary"
            onChange={(event) => setRegionLabelsEnabled(event.target.checked)}
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
            onChange={(event) => setShowHiddenFeaturesInSummary(event.target.checked)}
            checked={showHiddenFeaturesInSummary}
          />
        </Box>
        <Box className={classes.optionContainer}>
          <LocalizedTypography className={classes.label} i18nKey="map-ui:options-display-debug" />
          <Switch
            size="small"
            color="primary"
            onChange={(event) => setEditorDebugEnabled(event.target.checked)}
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
            onConfirm={clearPreferences}
          />
        </Box>
      </BorderBox>
    </TabView>
  );
};

const ControlsTabOptions = connector(_ControlsTabOptions);

export default ControlsTabOptions;
