/**
 * Provides the view which displays the popup menu for individual features
 * in the About > Summary tab of the map controls.
 */

import { Menu, MenuItem, IconButton, makeStyles } from '@material-ui/core';
import { Menu as MenuIcon } from '@material-ui/icons';
import _ from 'lodash';
import React from 'react';
import { connect } from 'react-redux';
import Tooltip from 'react-tooltip';

import { MapFeatures } from '~/components/data/MapFeatures';
import { t } from '~/components/i18n/Localization';
import { getUnixTimestamp } from '~/components/Util';
import store from '~/redux';
import { clearFeatureCompleted, clearFeatureMarkersCompleted } from '~/redux/ducks/completed';
import { setFeatureDisplayed } from '~/redux/ducks/displayed';
import { setEditorHighlight, setPositionAndZoom } from '~/redux/ducks/ui';

const useStyles = makeStyles((_theme) => ({
  menuButtonRoot: {
    backgroundColor: '#313131',
    color: '#1976d2',
    '&:hover': {
      backgroundColor: '#515151',
    },
  },
}));

const _MapControlSummaryFeatureMenu = ({
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
  const doesExpire = (mapFeature?.respawn ?? -1) !== -1;

  const [menuAnchor, setMenuAnchor] = React.useState(null);

  const handleOpen = (event) => {
    setMenuAnchor(event.currentTarget);
  };

  const handleClose = () => {
    setMenuAnchor(null);
  };

  return (
    <>
      <Tooltip place="left" />
      <IconButton
        classes={{ root: classes.menuButtonRoot }}
        variant="contained"
        aria-label={t('map-summary-menu-open')}
        onClick={handleOpen}
      >
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
        <MenuItem onClick={locateFeature}>{t('map-summary-menu-locate')}</MenuItem>
        {doesExpire ? (
          <MenuItem onClick={clearExpiredFeature}>{t('map-summary-menu-clear-expired')}</MenuItem>
        ) : null}
        {displayed ? (
          <MenuItem onClick={hideFeature}>{t('map-summary-menu-hide-feature')}</MenuItem>
        ) : (
          <MenuItem onClick={showFeature}>{t('map-summary-menu-show-feature')}</MenuItem>
        )}
        <MenuItem onClick={clearAllFeature}>{t('map-summary-menu-clear-all')}</MenuItem>
      </Menu>
    </>
  );
};

const mapStateToProps = (state, { featureKey }) => ({
  displayed: state.displayed.features[featureKey],
});
const mapDispatchToProps = (dispatch, { featureKey }) => {
  const mapFeature = MapFeatures[featureKey];
  return {
    clearAllFeature: () => dispatch(clearFeatureCompleted(featureKey)),
    clearExpiredFeature: () => {
      const currentCompleted = store.getState().completed.features[featureKey];
      const now = getUnixTimestamp();
      const toClear = _.keys(
        _.pickBy(currentCompleted, (markerTime) => {
          // Is respawn set, and has the respawn time elapsed?
          return (mapFeature?.respawn ?? -1) !== -1 && now - markerTime > mapFeature?.respawn;
        })
      );
      dispatch(clearFeatureMarkersCompleted(featureKey, toClear));
    },
    locateFeature: () => {
      const HIGHLIGHT_ZOOM_LEVEL = 8;
      const completedMarkers = _.keys(store.getState().completed.features[featureKey]);
      const uncompletedMarkers = _.filter(mapFeature.data, (value) => {
        return !completedMarkers.includes(value.id);
      });
      const randomMarker = _.sample(uncompletedMarkers);

      dispatch(setEditorHighlight(randomMarker.id));
      dispatch(
        setPositionAndZoom(
          {
            lat: randomMarker.geometry.coordinates[0],
            lng: randomMarker.geometry.coordinates[1],
          },
          HIGHLIGHT_ZOOM_LEVEL
        )
      );
    },
    hideFeature: () => {
      dispatch(setFeatureDisplayed(featureKey, false));
    },
    showFeature: () => {
      dispatch(setFeatureDisplayed(featureKey, true));
    },
  };
};
const MapControlSummaryFeatureMenu = connect(
  mapStateToProps,
  mapDispatchToProps
)(_MapControlSummaryFeatureMenu);

export default MapControlSummaryFeatureMenu;
