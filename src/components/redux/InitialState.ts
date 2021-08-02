import { initialState as achievementsInitialState } from 'src/components/redux/slices/achievements';
import { initialState as commonInitialState } from 'src/components/redux/slices/common';
import { initialState as mapInitialState } from 'src/components/redux/slices/map';

/**
 * The initial state for the redux store.
 * This was originally located in the Types.ts file for conciseness,
 * but this caused build issues.
 */
const initialState = {
  common: commonInitialState,
  achievements: achievementsInitialState,
  map: mapInitialState,
};

export default initialState;
