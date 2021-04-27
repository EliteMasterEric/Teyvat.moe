import { LoadingState } from './Types';

// Define the initial state
const initialState: LoadingState = {
  loadMapFeatures: false,
  loadMapRoutes: false,
  loadLeafletTiles: false,
  countMapFeatures: false,
  countMapRoutes: false,
  handlePermalinks: 'skip',
};

export default initialState;
