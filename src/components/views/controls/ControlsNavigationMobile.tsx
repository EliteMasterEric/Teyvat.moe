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

import { MapRegionKeys, MapRegions } from '~/components/data/MapRegions';
import { selectIsTabDisplayed, selectOpen } from '~/components/redux/slices/ui';
import { AppState } from '~/components/redux/types';
import ControlsFoldButton from '~/components/views/controls/sidebar/ControlsFoldButton';
import ControlsRegionButton from '~/components/views/controls/sidebar/ControlsRegionButton';

const mapStateToProps = (state: AppState) => ({
  displayRegions: selectOpen(state) && selectIsTabDisplayed(state, ['features', 'routes']),
});
const mapDispatchToProps = () => ({});
const connector = connect(mapStateToProps, mapDispatchToProps);

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
        ? MapRegionKeys.map((key) =>
            MapRegions[key]?.enabled ? <ControlsRegionButton key={key} regionKey={key} /> : null
          )
        : null}
    </Box>
  );
};

const ControlsNavigationMobile = connector(_ControlsNavigationMobile);

export default ControlsNavigationMobile;
