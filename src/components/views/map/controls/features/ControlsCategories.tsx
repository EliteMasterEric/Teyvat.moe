/**
 * Provides the interface for the Categories tabs
 * within the Features and Routes tabs of the Map controls.
 */

import _ from 'lodash';
import { FunctionComponent } from 'react';
import { connect, ConnectedProps } from 'react-redux';
import { MapCategoryKeys } from 'src/components/data/map/MapCategories';
import BorderBox from 'src/components/interface/BorderBox';
import { selectTab } from 'src/components/redux/slices/map/interface/Selector';
import { AppState } from 'src/components/redux/Types';
import { Empty } from 'src/components/Types';
import ControlsCategoryButton from 'src/components/views/map/controls/features/ControlsCategoryButton';

const mapStateToProps = (state: AppState) => ({
  displayed: _.includes(['features', 'routes'], selectTab(state)),
});
type ControlsCategoriesStateProps = ReturnType<typeof mapStateToProps>;
const connector = connect<ControlsCategoriesStateProps, Empty, Empty, AppState>(mapStateToProps);

type ControlsCategoriesProps = ConnectedProps<typeof connector>;

const _ControlsCategories: FunctionComponent<ControlsCategoriesProps> = ({ displayed }) => {
  return (
    <BorderBox displayed={displayed} direction="row" grow={false} wrap>
      {_.map(MapCategoryKeys, (key) => {
        return <ControlsCategoryButton key={key} categoryKey={key} />;
      })}
    </BorderBox>
  );
};

const ControlsCategories = connector(_ControlsCategories);

export default ControlsCategories;
