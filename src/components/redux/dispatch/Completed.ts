import { dispatchAction } from './Base';
import { MSFMarkerKey } from 'src/components/data/Element';
import { clearMarkerCompleted, setMarkerCompleted } from 'src/components/redux/slices/Completed';

export const setMapMarkerCompleted = (key: MSFMarkerKey): void => {
  dispatchAction(setMarkerCompleted(key));
};
export const clearMapMarkerCompleted = (key: MSFMarkerKey): void => {
  dispatchAction(clearMarkerCompleted(key));
};
