import _ from 'lodash';
import initialState from './InitialState';
import { EditorState } from './Types';
import { MapCategoryKey } from 'src/components/data/map/MapCategories';
import { MapRegionKey } from 'src/components/data/map/MapRegions';
import { EditorMarker, EditorRoute } from 'src/components/preferences/map/EditorDataSchema';
import selectNamespace from 'src/components/redux/slices/map/Selector';
import { MapState } from 'src/components/redux/slices/map/Types';
import { AppState } from 'src/components/redux/Types';

export const selectEditorFeatureName = (state: AppState): string =>
  selectSlice(selectNamespace(state))?.feature.name;
export const selectEditorFeatureCategory = (state: AppState): MapCategoryKey =>
  selectSlice(selectNamespace(state))?.feature.category;
export const selectEditorFeatureRegion = (state: AppState): MapRegionKey =>
  selectSlice(selectNamespace(state))?.feature.region;
export const selectEditorFeatureData = (state: AppState): (EditorMarker | EditorRoute)[] =>
  selectSlice(selectNamespace(state))?.feature.data;

const selectSlice = (state: MapState | null): EditorState => {
  return state?.editor ?? initialState;
};
export default selectSlice;
