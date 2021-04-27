/**
 * When the window is small enough, region tabs on the side can't be displayed.
 *
 * In that case, this provides the view that puts them (and the Fold button)
 * above the tabs in the map controls.
 */

import { Box } from '@material-ui/core';
import _ from 'lodash';
import React, { FunctionComponent } from 'react';
import { connect, ConnectedProps } from 'react-redux';

import { MapRegionKeys, getMapRegion } from 'src/components/data/map/MapRegions';
import {
  selectIsTabDisplayed,
  selectOpen,
} from 'src/components/redux/slices/map/interface/Selector';
import { AppState } from 'src/components/redux/Types';
import { Empty } from 'src/components/Types';
import ControlsFoldButton from 'src/components/views/map/controls/sidebar/ControlsFoldButton';
import ControlsRegionButton from 'src/components/views/map/controls/sidebar/ControlsRegionButton';

const mapStateToProps = (state: AppState) => ({
  displayRegions: selectOpen(state) && selectIsTabDisplayed(state, ['features', 'routes']),
});
type ControlsNavigationMobileStateProps = ReturnType<typeof mapStateToProps>;
const connector = connect<ControlsNavigationMobileStateProps, Empty, Empty, AppState>(
  mapStateToProps
);

type ControlsNavigationMobileProps = ConnectedProps<typeof connector>;

/**
 * The button next to the Map Controls.
 * Pressing it collapses or expands the Map Controls.
 * @param {*} isOpen The state of the Map Controls. True means they are open.
 * @param {*} setOpen The function to change the state of the Map Controls.
 */
const _ControlsNavigationMobile: FunctionComponent<ControlsNavigationMobileProps> = ({
  displayRegions,
}) => {
  return (
    <Box display="flex" flexGrow="0" justifyContent="center" flexWrap="wrap">
      <ControlsFoldButton button fixedPosition={false} />
      {displayRegions
        ? _.map(MapRegionKeys, (key) =>
            getMapRegion(key).enabled ? <ControlsRegionButton key={key} regionKey={key} /> : null
          )
        : null}
    </Box>
  );
};

const ControlsNavigationMobile = connector(_ControlsNavigationMobile);

export default ControlsNavigationMobile;
