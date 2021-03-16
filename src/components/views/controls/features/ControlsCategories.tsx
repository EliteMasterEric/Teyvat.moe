/**
 * Provides the interface for the Categories tabs
 * within the Features and Routes tabs of the Map controls.
 */

import React, { FunctionComponent } from 'react';
import { connect, ConnectedProps } from 'react-redux';
import { MapCategoryKeys } from '~/components/data/MapCategories';
import BorderBox from '~/components/interface/BorderBox';
import { setMapCategory, setTab } from '~/components/redux/slices/ui';
import ControlsCategoryButton from '~/components/views/controls/features/ControlsCategoryButton';

const mapStateToProps = (state) => ({
  displayed: ['features', 'routes'].includes(state.controlsTab),
});
const mapDispatchToProps = (dispatch) => ({
  setTab: (tab) => dispatch(setTab(tab)),
  setCategory: (categoryKey) => dispatch(setMapCategory(categoryKey)),
});
const connector = connect(mapStateToProps, mapDispatchToProps);
type ControlsCategoriesProps = ConnectedProps<typeof connector>;

const _ControlsCategories: FunctionComponent<ControlsCategoriesProps> = ({ displayed }) => {
  return (
    <BorderBox displayed={displayed} direction="row" grow={false} wrap>
      {MapCategoryKeys.map((key) => {
        return <ControlsCategoryButton key={key} categoryKey={key} />;
      })}
    </BorderBox>
  );
};

const ControlsCategories = connector(_ControlsCategories);

export default ControlsCategories;
