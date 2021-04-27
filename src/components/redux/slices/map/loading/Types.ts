export type LoadingEnum = false | 'progress' | 'error' | 'skip' | true;

export type LoadingState = {
  loadMapFeatures: LoadingEnum;
  loadMapRoutes: LoadingEnum;
  loadLeafletTiles: LoadingEnum;
  countMapFeatures: LoadingEnum;
  countMapRoutes: LoadingEnum;
  handlePermalinks: LoadingEnum;
};

export type SetLoadingActionPayload = {
  loadingKey: keyof LoadingState;
  newValue: LoadingEnum;
};
