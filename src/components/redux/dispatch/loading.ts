import { setLoading } from '../slices/ui';
import { dispatchAction } from './base';

export const setLoadingInitialized = (status: boolean): void => {
  dispatchAction(setLoading('initializedLoading', status));
};

export const setLoadingFeatures = (status: boolean): void => {
  dispatchAction(setLoading('loadMapFeatures', status));
};

export const setLoadingFeatureCount = (status: boolean): void => {
  dispatchAction(setLoading('countMapFeatures', status));
};

export const setLoadingRoutes = (status: boolean): void => {
  dispatchAction(setLoading('loadMapRoutes', status));
};

export const setLoadingRouteCount = (status: boolean): void => {
  dispatchAction(setLoading('countMapRoutes', status));
};

export const setLoadingTiles = (status: boolean): void => {
  dispatchAction(setLoading('loadLeafletTiles', status));
};
