import React from 'react';
import clsx from 'clsx';

import Tooltip from 'react-tooltip';
import newGithubIssueUrl from 'new-github-issue-url';

import ClearEditorDataPopup from '../popups/ClearEditorDataPopup';
import SubmitEditorDataPopup from '../popups/SubmitEditorDataPopup';

import { DEFAULT_MAP_PREFERENCES } from '../Preferences';
import { generatePrettyJSON, openURLInWindow } from '../Util';

import './MapControlEditor.css';

const HIGHLIGHT_ZOOM_LEVEL = 8;

const MapEditorMarker = ({
  highlighted,
  marker,
  deleteMarker,
  highlightMarker,
  updateMarkerProperties,
}) => {
  const updateMarkerProp = (key) => (event) => {
    const index = marker?.id - 1;
    updateMarkerProperties(index, key, event.target.value);
  };

  return (
    <div key={marker?.id} className={clsx('map-controls-editor-element')}>
      <div className={clsx('map-controls-editor-element-row')}>
        <div
          data-tip="Highlight"
          onClick={() => highlightMarker(marker)}
          onKeyDown={() => highlightMarker(marker)}
          role="button"
          aria-label="highlight"
          tabIndex={0}
          className={clsx(
            'nf',
            'nf-mdi-crosshairs_gps',
            'map-controls-editor-element-button',
            highlighted
              ? 'map-controls-editor-element-highlight-on'
              : 'map-controls-editor-element-highlight'
          )}
        />

        <span className={clsx('map-controls-editor-element-label')}>Marker #{marker?.id}</span>

        <Tooltip />

        <div
          data-tip="Delete"
          onClick={() => deleteMarker(marker)}
          onKeyDown={() => deleteMarker(marker)}
          role="button"
          aria-label="Delete"
          tabIndex={0}
          className={clsx(
            'nf',
            'nf-fa-trash',
            'map-controls-editor-element-button',
            'map-controls-editor-element-trash'
          )}
        />
      </div>
      <div className={clsx('map-controls-editor-element-row')}>
        <span className={clsx('map-controls-editor-element-label')}>Name</span>
        <input value={marker?.properties?.popupTitle} onChange={updateMarkerProp('popupTitle')} />
      </div>
      <div className={clsx('map-controls-editor-element-row')}>
        <span className={clsx('map-controls-editor-element-label')}>Content</span>
        <textarea
          value={marker?.properties?.popupContent}
          onChange={updateMarkerProp('popupContent')}
        />
      </div>
      <div className={clsx('map-controls-editor-element-row')}>
        <span className={clsx('map-controls-editor-element-label')}>Image Path</span>
        <input
          placeholder="none"
          value={marker?.properties?.popupImage}
          onChange={updateMarkerProp('popupImage')}
        />
      </div>
    </div>
  );
};

const MapEditorRoute = ({
  highlighted,
  route,
  deleteRoute,
  highlightRoute,
  updateRouteProperties,
}) => {
  const updateRouteProp = (key) => (event) => {
    const index = route?.id - 1;
    updateRouteProperties(index, key, event.target.value);
  };

  return (
    <div key={route?.id} className={clsx('map-controls-editor-element')}>
      <div className={clsx('map-controls-editor-element-row')}>
        <div
          data-tip="Highlight"
          onClick={() => highlightRoute(route)}
          onKeyDown={() => highlightRoute(route)}
          role="button"
          aria-label="highlight"
          tabIndex={0}
          className={clsx(
            'nf',
            'nf-mdi-crosshairs_gps',
            'map-controls-editor-element-button',
            highlighted
              ? 'map-controls-editor-element-highlight-on'
              : 'map-controls-editor-element-highlight'
          )}
        />

        <span className={clsx('map-controls-editor-element-label')}>Route #{route?.id}</span>

        <Tooltip />

        <div
          data-tip="Delete"
          onClick={() => deleteRoute(route)}
          onKeyDown={() => deleteRoute(route)}
          role="button"
          aria-label="Delete"
          tabIndex={0}
          className={clsx(
            'nf',
            'nf-fa-trash',
            'map-controls-editor-element-button',
            'map-controls-editor-element-trash'
          )}
        />
      </div>
      <div className={clsx('map-controls-editor-element-row')}>
        <span className={clsx('map-controls-editor-element-label')}>Name</span>
        <input value={route?.properties?.popupTitle} onChange={updateRouteProp('popupTitle')} />
      </div>
      <div className={clsx('map-controls-editor-element-row')}>
        <span className={clsx('map-controls-editor-element-label')}>Content</span>
        <textarea
          value={route?.properties?.popupContent}
          onChange={updateRouteProp('popupContent')}
        />
      </div>
      <div className={clsx('map-controls-editor-element-row')}>
        <span className={clsx('map-controls-editor-element-label')}>Image Path</span>
        <input value={route?.properties?.popupImage} onChange={updateRouteProp('popupImage')} />
      </div>
    </div>
  );
};

const MapControlEditor = ({ mapPreferences, setMapPreferences, setTab }) => {
  const setElementData = (func) => {
    setMapPreferences((old) => {
      return {
        ...old,
        editor: {
          ...old?.editor,
          highlighted: -1, // Clear the highlight when data changes.
          feature: {
            ...old?.editor?.feature,
            data: func(old?.editor?.feature?.data),
          },
        },
      };
    });
  };

  const highlightMarker = (marker) => {
    setMapPreferences((old) => {
      return {
        ...old,
        position: {
          latlng: {
            // REVERSED by GeoJSON.
            lat: marker.geometry.coordinates[1],
            lng: marker.geometry.coordinates[0],
          },
          zoom: HIGHLIGHT_ZOOM_LEVEL,
        },
        editor: {
          ...old.editor,
          highlighted: marker?.id,
        },
      };
    });
  };

  const highlightRoute = (route) => {
    setMapPreferences((old) => {
      return {
        ...old,
        position: {
          latlng: {
            // REVERSED by GeoJSON.
            // Use the first point of the route.
            lat: route.geometry.coordinates[0][1],
            lng: route.geometry.coordinates[0][0],
          },
          zoom: HIGHLIGHT_ZOOM_LEVEL,
        },
        editor: {
          ...old.editor,
          highlighted: route?.id,
        },
      };
    });
  };

  const updateElementProperties = (index, key, value) => {
    setElementData((old) => {
      const newElementData = old;

      newElementData[index] = {
        ...newElementData[index],
        properties: {
          ...newElementData[index].properties,
          [key]: value,
        },
      };
      return newElementData;
    });
  };

  const resetIndices = () => {
    setElementData((old) => {
      return old.map((marker, index) => ({ ...marker, id: index + 1 }));
    });
  };

  const deleteElement = (marker) => {
    const index = mapPreferences?.editor?.feature?.data.indexOf(marker);
    setElementData((old) => {
      const newMarkerData = old;
      newMarkerData.splice(index, 1);
      return newMarkerData;
    });

    resetIndices();
  };

  const submitEditorData = (title) => {
    const jsonData = generatePrettyJSON(mapPreferences?.editor?.feature);

    const url = newGithubIssueUrl({
      user: 'genshinmap',
      repo: 'genshinmap.github.io',
      title: `[EDITOR] ${title}`,
      body: `The following data was generated by this user using the Editor mode. Any required images should be uploaded to this issue by dragging and dropping.\n\`\`\`\n${jsonData}\n\`\`\``,
    });

    openURLInWindow(url);
  };

  const clearEditorData = () => {
    setMapPreferences((old) => {
      return {
        ...old,
        editor: DEFAULT_MAP_PREFERENCES.editor,
      };
    });
    setTab('features');
  };

  return (
    <div className={clsx('map-controls-editor-container')}>
      <div className={clsx('map-controls-editor-element-container')}>
        {mapPreferences?.editor?.feature?.data.map((element) => {
          const isRoute = element?.geometry?.type === 'LineString';

          return isRoute ? (
            <MapEditorRoute
              key={element?.id}
              route={element}
              deleteRoute={deleteElement}
              highlightRoute={highlightRoute}
              updateRouteProperties={updateElementProperties}
            />
          ) : (
            <MapEditorMarker
              key={element?.id}
              marker={element}
              deleteMarker={deleteElement}
              highlightMarker={highlightMarker}
              updateMarkerProperties={updateElementProperties}
            />
          );
        })}
      </div>
      <ClearEditorDataPopup
        trigger={
          <div
            role="button"
            aria-label="Clear"
            tabIndex={0}
            className={clsx('map-controls-editor-button')}
          >
            Clear Editor Data
          </div>
        }
        onConfirm={clearEditorData}
      />

      <SubmitEditorDataPopup
        trigger={
          <div
            onClick={submitEditorData}
            onKeyDown={submitEditorData}
            role="button"
            aria-label="Submit"
            tabIndex={0}
            className={clsx('map-controls-editor-button')}
          >
            Submit Editor Data
          </div>
        }
        onConfirm={submitEditorData}
      />
    </div>
  );
};

export default MapControlEditor;
