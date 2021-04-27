import { CommonState } from 'src/components/redux/slices/common/Types';
import { MapState } from 'src/components/redux/slices/map/Types';

export type AppState = {
  common: CommonState;
  map: MapState;
};

export type AppWatcher = (state: AppState) => void;
