/**
 * Provides the view which displays the popup menu for individual features
 * in the About > Summary tab of the map controls.
 */

import { Menu, MenuItem, IconButton, makeStyles } from '@material-ui/core';
import { Menu as MenuIcon } from '@material-ui/icons';
import _ from 'lodash';
import React, { useState, FunctionComponent } from 'react';
import { connect } from 'react-redux';
import Tooltip from 'react-tooltip';
import { MSFFeatureKey, MSFMarkerKey } from '~/components/data/ElementSchema';

import { MapFeatures } from '~/components/data/MapFeatures';
import { t } from '~/components/i18n/Localization';
import { AppDispatch, store } from '~/components/redux';
import {
  clearFeatureCompleted,
  clearMarkersCompleted,
  selectCompletedMarkersOfFeature,
  selectMarkerCompleted,
} from '~/components/redux/slices/completed';
import {
  clearFeatureDisplayed,
  selectIsFeatureDisplayed,
  setFeatureDisplayed,
} from '~/components/redux/slices/displayed';
import { setMapHighlight, setMapPosition } from '~/components/redux/slices/ui';
import { AppState } from '~/components/redux/types';
import { getUnixTimestamp } from '~/components/util';

const useStyles = makeStyles((_theme) => ({
  menuButtonRoot: {
    backgroundColor: '#313131',
    color: '#1976d2',
    '&:hover': {
      backgroundColor: '#515151',
    },
  },
}));

interface ControlsSummaryFeatureMenu {
  featureKey: MSFFeatureKey;

  displayed: boolean;

  hideFeature: () => void;
  showFeature: () => void;
  clearAllFeature: () => void;
  clearExpiredFeature: () => void;
  locateFeature: () => void;
}

const _ControlsSummaryFeatureMenu: FunctionComponent<ControlsSummaryFeatureMenu> = ({
  featureKey,

  displayed,

  hideFeature,
  showFeature,
  clearAllFeature,
  clearExpiredFeature,
  locateFeature,
}) => {
  const classes = useStyles();

  const mapFeature = MapFeatures[featureKey];
  const doesExpire = (mapFeature?.respawn ?? 'none') !== 'none';

  const [menuAnchor, setMenuAnchor] = useState(null);

  const handleOpen = (event) => {
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

const mapStateToProps = (state: AppState, { featureKey }: { featureKey: MSFFeatureKey }) => ({
  displayed: selectIsFeatureDisplayed(state, featureKey),
});
const mapDispatchToProps = (
  dispatch: AppDispatch,
  { featureKey }: { featureKey: MSFFeatureKey }
) => {
  const mapFeature = MapFeatures[featureKey];
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
        return now - completedTime > mapFeature?.respawn;
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

      dispatch(setMapHighlight(randomMarker.id));
      dispatch(
        setMapPosition(
          {
            lat: randomMarker?.coordinates[0],
            lng: randomMarker?.coordinates[1],
          },
          HIGHLIGHT_ZOOM_LEVEL
        )
      );
    },
    hideFeature: () => {
      dispatch(clearFeatureDisplayed(featureKey));
    },
    showFeature: () => {
      dispatch(setFeatureDisplayed(featureKey));
    },
  };
};
const ControlsSummaryFeatureMenu = connect(
  mapStateToProps,
  mapDispatchToProps
)(_ControlsSummaryFeatureMenu);

export default ControlsSummaryFeatureMenu;
