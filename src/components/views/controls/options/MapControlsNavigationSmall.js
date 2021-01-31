/**
 * When the window is small enough, region tabs on the side can't be displayed.
 *
 * In that case, this provides the view that puts them (and the Fold button)
 * above the tabs in the map controls.
 */

import { Box } from '@material-ui/core';
import _ from 'lodash';
import React from 'react';
import { connect } from 'react-redux';

import MapRegions from '~/components/data/MapRegions';
import MapControlsRegionButton from '~/components/views/controls/sidebar/MapControlsRegionButton';
import { setControlsOpen } from '~/redux/ducks/ui';
import MapControlsFoldButton from '~/components/views/controls/sidebar/MapControlsFoldButton';

/**
 * The button next to the Map Controls.
 * Pressing it collapses or expands the Map Controls.
 * @param {*} isOpen The state of the Map Controls. True means they are open.
 * @param {*} setOpen The function to change the state of the Map Controls.
 */
const _MapControlsNavigationSmall = ({ displayRegions, open, setOpen }) => {
  return (
    <Box display="flex" flexGrow="0" justifyContent="center" flexWrap="wrap">
      <MapControlsFoldButton button fixedPosition={false} open={open} setOpen={setOpen} />
      {displayRegions
        ? _.keys(MapRegions).map((key) =>
            MapRegions[key]?.enabled ? <MapControlsRegionButton key={key} regionKey={key} /> : null
          )
        : null}
    </Box>
  );
};

const mapStateToProps = (state) => ({
  open: state.controlsOpen,
  displayRegions: state.controlsOpen && ['features', 'routes'].includes(state.controlsTab),
});
const mapDispatchToProps = (dispatch) => ({ setOpen: (open) => dispatch(setControlsOpen(open)) });
const MapControlsNavigationSmall = connect(
  mapStateToProps,
  mapDispatchToProps
)(_MapControlsNavigationSmall);

export default MapControlsNavigationSmall;
