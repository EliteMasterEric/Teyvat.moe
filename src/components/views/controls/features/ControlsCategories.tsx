/**
 * Provides the interface for the Categories tabs
 * within the Features and Routes tabs of the Map controls.
 */

import { FunctionComponent } from 'react';
import { connect, ConnectedProps } from 'react-redux';
import { MapCategoryKey, MapCategoryKeys } from 'src/components/data/MapCategories';
import BorderBox from 'src/components/interface/BorderBox';
import { AppDispatch } from 'src/components/redux';
import { selectTab, setMapCategory, setTab } from 'src/components/redux/slices/ui';
import { AppState } from 'src/components/redux/types';
import { Empty, UIControlsTab } from 'src/components/Types';
import ControlsCategoryButton from 'src/components/views/controls/features/ControlsCategoryButton';

const mapStateToProps = (state: AppState) => ({
  displayed: ['features', 'routes'].includes(selectTab(state)),
});
const mapDispatchToProps = (dispatch: AppDispatch) => ({
  setTab: (tab: UIControlsTab) => dispatch(setTab(tab)),
  setCategory: (categoryKey: MapCategoryKey) => dispatch(setMapCategory(categoryKey)),
});
type ControlsCategoriesStateProps = ReturnType<typeof mapStateToProps>;
type ControlsCategoriesDispatchProps = ReturnType<typeof mapDispatchToProps>;
const connector = connect<
  ControlsCategoriesStateProps,
  ControlsCategoriesDispatchProps,
  Empty,
  AppState
>(mapStateToProps, mapDispatchToProps);

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
