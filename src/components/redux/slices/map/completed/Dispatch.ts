import { setMarkersCompleted } from './Actions';
import { MSFMarkerKey } from 'src/components/data/map/Element';
import { dispatchAction } from 'src/components/redux/Dispatch';

export const dispatchSetMarkersCompleted = (markers: MSFMarkerKey[]): void => {
  dispatchAction(setMarkersCompleted(markers));
};
