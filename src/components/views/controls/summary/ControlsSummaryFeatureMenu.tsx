/**
 * Provides the view which displays the popup menu for individual features
 * in the About > Summary tab of the map controls.
 */

import { Menu, MenuItem, IconButton, makeStyles } from '@material-ui/core';
import { Menu as MenuIcon } from '@material-ui/icons';
import _ from 'lodash';
import React, { useState, FunctionComponent } from 'react';
import { connect, ConnectedProps } from 'react-redux';
import Tooltip from 'react-tooltip';
import { MSFFeatureKey, MSFMarkerKey } from 'src/components/data/Element';

import { getMapFeature } from 'src/components/data/MapFeatures';
import { t } from 'src/components/i18n/Localization';
import { AppDispatch, store } from 'src/components/redux';
import {
  clearFeatureCompleted,
  clearMarkersCompleted,
  selectCompletedMarkersOfFeature,
  selectMarkerCompleted,
} from 'src/components/redux/slices/completed';
import {
  clearFeatureDisplayed,
  selectIsFeatureDisplayed,
  setFeatureDisplayed,
} from 'src/components/redux/slices/displayed';
import { setMapHighlight, setMapPosition } from 'src/components/redux/slices/ui';
import { AppState } from 'src/components/redux/types';
import { getUnixTimestamp } from 'src/components/util';

const useStyles = makeStyles((_theme) => ({
  menuButtonRoot: {
    backgroundColor: '#313131',
    color: '#1976d2',
    '&:hover': {
      backgroundColor: '#515151',
    },
  },
}));

interface ControlsSummaryFeatureMenuBaseProps {
  featureKey: MSFFeatureKey;
}

const mapStateToProps = (state: AppState, { featureKey }: ControlsSummaryFeatureMenuBaseProps) => ({
  displayed: selectIsFeatureDisplayed(state, featureKey),
});
const mapDispatchToProps = (
  dispatch: AppDispatch,
  { featureKey }: ControlsSummaryFeatureMenuBaseProps
) => {
  const mapFeature = getMapFeature(featureKey);
  return {
    clearAllFeature: () => dispatch(clearFeatureCompleted(featureKey)),
    clearExpiredFeature: () => {
      const currentCompleted = _.keys(
        selectCompletedMarkersOfFeature(store.getState(), featureKey)
      ) as MSFMarkerKey[];
      const now = getUnixTimestamp();
      const toClear = _.filter(currentCompleted, (markerKey) => {
        const completedTime = selectMarkerCompleted(store.getState(), markerKey);
        // Is respawn set, and has the respawn time elapsed?
        return completedTime != null && now - completedTime > mapFeature.respawn;
      });
      dispatch(clearMarkersCompleted(toClear));
    },
    locateFeature: () => {
      const HIGHLIGHT_ZOOM_LEVEL = 10;
      const currentCompleted = _.filter(_.keys(store.getState().completed.features), (key) =>
        key.startsWith(featureKey)
      );
      const uncompletedMarkers = _.filter(mapFeature.data, (value) => {
        return !currentCompleted.includes(`${featureKey}/${value.id}`);
      });
      const randomMarker = _.sample(uncompletedMarkers);

      if (randomMarker != null) {
        dispatch(setMapHighlight(randomMarker.id));
        dispatch(
          setMapPosition(
            {
              lat: randomMarker.coordinates[0],
              lng: randomMarker.coordinates[1],
            },
            HIGHLIGHT_ZOOM_LEVEL
          )
        );
      }
    },
    hideFeature: () => {
      dispatch(clearFeatureDisplayed(featureKey));
    },
    showFeature: () => {
      dispatch(setFeatureDisplayed(featureKey));
    },
  };
};
type ControlsSummaryFeatureMenuStateProps = ReturnType<typeof mapStateToProps>;
type ControlsSummaryFeatureMenuDispatchProps = ReturnType<typeof mapDispatchToProps>;
const connector = connect<
  ControlsSummaryFeatureMenuStateProps,
  ControlsSummaryFeatureMenuDispatchProps,
  ControlsSummaryFeatureMenuBaseProps,
  AppState
>(mapStateToProps, mapDispatchToProps);

type ControlsSummaryFeatureMenuProps = ConnectedProps<typeof connector> &
  ControlsSummaryFeatureMenuBaseProps;

const _ControlsSummaryFeatureMenu: FunctionComponent<ControlsSummaryFeatureMenuProps> = ({
  featureKey,

  displayed,

  hideFeature,
  showFeature,
  clearAllFeature,
  clearExpiredFeature,
  locateFeature,
}) => {
  const classes = useStyles();

  const mapFeature = getMapFeature(featureKey);
  const doesExpire = (mapFeature.respawn ?? 'none') !== 'none';

  const [menuAnchor, setMenuAnchor] = useState<HTMLButtonElement | null>(null);

  const handleOpen: React.MouseEventHandler<HTMLButtonElement> = (event) => {
    setMenuAnchor(event.currentTarget);
  };

  const handleClose = () => {
    setMenuAnchor(null);
  };

  return (
    <>
      <Tooltip place="left" />
      <IconButton classes={{ root: classes.menuButtonRoot }} onClick={handleOpen}>
        <MenuIcon />
      </IconButton>

      <Menu
        id="summary-menu"
        anchorEl={menuAnchor}
        open={Boolean(menuAnchor)}
        onClose={handleClose}
        getContentAnchorEl={null}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
        transformOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
      >
        <MenuItem onClick={locateFeature}>{t('locate')}</MenuItem>
        {doesExpire ? (
          <MenuItem onClick={clearExpiredFeature}>{t('clear-refreshed-markers')}</MenuItem>
        ) : null}
        {displayed ? (
          <MenuItem onClick={hideFeature}>{t('hide-feature')}</MenuItem>
        ) : (
          <MenuItem onClick={showFeature}>{t('show-feature')}</MenuItem>
        )}
        <MenuItem onClick={clearAllFeature}>{t('clear-all')}</MenuItem>
      </Menu>
    </>
  );
};

const ControlsSummaryFeatureMenu = connector(_ControlsSummaryFeatureMenu);

export default ControlsSummaryFeatureMenu;
