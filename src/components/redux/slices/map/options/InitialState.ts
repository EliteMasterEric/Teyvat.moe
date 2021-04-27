import { OptionsState } from './Types';

// Define the initial state using that type
const initialState: OptionsState = {
  completedAlpha: 0.5, // Make 'Done' markers transparent.
  clusterMarkers: true, // Cluster nearby markers.
  worldBorderEnabled: true, // Display a red border on the area outside the playable space.
  regionLabelsEnabled: true, // Display text over notable regions.
  hideFeaturesInEditor: false, // Remove clutter while editing.
  hideRoutesInEditor: false, // Remove clutter while editing.
  showHiddenFeaturesInSummary: false, // Display features in the summary tab with some markers
  // completed, even when the feature is hidden.
  overrideLang: null, // Override the current language.
};

export default initialState;
