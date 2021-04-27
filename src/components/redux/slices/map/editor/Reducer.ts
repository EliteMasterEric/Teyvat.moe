import { createReducer } from '@reduxjs/toolkit';
import _ from 'lodash';
import {
  setFeatureName,
  setFeatureCategory,
  setFeatureRegion,
  clearElements,
  replaceMarker,
  replaceRoute,
  removeMarker,
  removeRoute,
  appendMarker,
  appendRoute,
  editMarker,
  editRoute,
} from './Actions';
import initialState from './InitialState';
import selectSlice from './Selector';
import { setPreferences, clearPreferences } from 'src/components/redux/slices/common/core';
import selectNamespace from 'src/components/redux/slices/map/Selector';

const displayedReducer = createReducer(initialState, (builder) => {
  builder
    .addCase(setFeatureName, (state, action) => {
      state.feature.name = action.payload;
    })
    .addCase(setFeatureCategory, (state, action) => {
      state.feature.category = action.payload;
    })
    .addCase(setFeatureRegion, (state, action) => {
      state.feature.region = action.payload;
    })
    .addCase(clearElements, (state) => {
      state.feature.data = [];
    })
    .addCase(replaceMarker, (state, action) => {
      state.feature.data = _.map(state.feature.data, (marker) =>
        marker.id === action.payload.existingId ? action.payload.newMarker : marker
      );
    })
    .addCase(replaceRoute, (state, action) => {
      state.feature.data = _.map(state.feature.data, (route) =>
        route.id === action.payload.existingId ? action.payload.newRoute : route
      );
    })
    .addCase(removeMarker, (state, action) => {
      state.feature.data = _.reject(state.feature.data, (element) => element.id == action.payload);
    })
    .addCase(removeRoute, (state, action) => {
      state.feature.data = _.reject(state.feature.data, (element) => element.id == action.payload);
    })
    .addCase(appendMarker, (state, action) => {
      state.feature.data.push(action.payload);
    })
    .addCase(appendRoute, (state, action) => {
      state.feature.data.push(action.payload);
    })
    .addCase(editMarker, (state, action) => {
      _.forEach(_.filter(state.feature.data, ['id', action.payload.existingId]), (marker) => {
        _.set(marker, action.payload.markerProperty, action.payload.propertyValue);
      });
    })
    .addCase(editRoute, (state, action) => {
      _.forEach(_.filter(state.feature.data, ['id', action.payload.existingId]), (route) => {
        _.set(route, action.payload.routeProperty, action.payload.propertyValue);
      });
    })
    .addCase(setPreferences, (state, action) => {
      return selectSlice(selectNamespace(action.payload)) ?? state;
    })
    .addCase(clearPreferences, () => {
      return initialState;
    });
});

export default displayedReducer;
