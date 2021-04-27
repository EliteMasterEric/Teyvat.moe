import { setFeatureDisplayed, setRouteGroupDisplayed } from './Actions';
import { MSFFeatureKey, MSFRouteGroupKey } from 'src/components/data/map/Element';
import { dispatchAction } from 'src/components/redux/Dispatch';

export const dispatchShowFeature = (key: MSFFeatureKey): void => {
  dispatchAction(setFeatureDisplayed(key));
};
export const dispatchShowRouteGroup = (key: MSFRouteGroupKey): void => {
  dispatchAction(setRouteGroupDisplayed(key));
};
