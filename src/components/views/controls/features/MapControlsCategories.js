/**
 * Provides the interface for the Categories tabs
 * within the Features and Routes tabs of the Map controls.
 */

import React from 'react';
import { connect } from 'react-redux';

import MapCategories from '~/components/data/MapCategories';
import BorderBox from '~/components/interface/BorderBox';
import MapControlsCategoryButton from '~/components/views/controls/features/MapControlsCategoryButton';
import { setControlsCategory, setControlsTab } from '~/redux/ducks/ui';

const _MapControlsCategories = ({ displayed }) => {
  return (
    <BorderBox displayed={displayed} direction="row" grow={false} wrap>
      {Object.keys(MapCategories).map((key) => {
        return <MapControlsCategoryButton key={key} categoryKey={key} />;
      })}
    </BorderBox>
  );
};

const mapStateToProps = (state) => ({
  displayed: ['features', 'routes'].includes(state.controlsTab),
});
const mapDispatchToProps = (dispatch) => ({
  setTab: (tab) => dispatch(setControlsTab(tab)),
  setCategory: (categoryKey) => dispatch(setControlsCategory(categoryKey)),
});
const MapControlsCategories = connect(mapStateToProps, mapDispatchToProps)(_MapControlsCategories);

export default MapControlsCategories;
