import { InterfaceState } from './Types';
import { MAP_CENTER, DEFAULT_ZOOM } from 'src/components/data/map/MapConstants';

// Define the initial state
const initialState: InterfaceState = {
  tab: 'help',
  mapCategory: 'special',
  mapRegion: 'mondstadt',

  open: true,
  mapHighlight: null,
  mapPosition: {
    latlng: {
      lat: MAP_CENTER[0],
      lng: MAP_CENTER[1],
    },
    zoom: DEFAULT_ZOOM,
  },
  editorEnabled: false,
  editorDebugEnabled: false,

  mapStats: {
    markerCount: null,
    routeCount: null,
  },

  permalinkId: null,
};

export default initialState;
