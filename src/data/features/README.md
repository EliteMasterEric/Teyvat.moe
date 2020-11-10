# data/features

Contains JSON data describing markers, with locations of features.

JSON files will be parsed and included in the map, and placed into the options pane based on region and category.

Note that `md` files will be ignored, so they can be used to provide notes as necessary.

## feature data format:

Below is documentation on the data format for features:

```json
{
  "name": {
    // The name of the Feature, as seen in the Controls menu's Feature tab.
    "en": "Ruin Guard", // Each key is a BCP-47 language tag.
    "fr": "Garde des ruines", // Specify values for specific languages here.
    "fr-ca": "Garde des ruines québécois", // Any languages that aren't specified will fall back to English.
    "es": "Guardia de la ruina", // The language used is chosen by the browser, which I believe pulls it from the operating system's settings.
    "zh": "废墟守卫" // There's also a language override in the settings.
  },
  "enabled": true, // Specify false to hide this feature from the Map controls. Defaults to true if not specified.
  "cluster": false, // If this is true, markers that are very close will be combined into a single marker.
  "respawn": 259200, // If this feature respawns on a regular timer, specify it here in seconds. This is used for the "Clear Expired" button.
  "icons": {
    "filter": "slime",
    "base": {
      // Base and Done use the same format, but there are two different modes based on the value of marker.
      "marker": true, // If this is true, use a marker icon and include the filter image on it. This is the simple mode.
      "key": "slime" // You can override the filter image used by the marker icon.
    },
    "done": {
      "marker": false, // If this is false or left off, use a custom marker. This is the advanced mode, used for things like statues.
      "key": "statue", // If marker is false, this is the name of the file in images/icons/map_base (or images/icons/map_done for 'done' markers)
      "svg": false, // If this value is true, the marker image file used will use the extension SVG (else it will use the PNG image).
      // Below are options to be passed to the L.icon constructor, properties of the marker displayed on the map.
      "iconSize": [30, 46], // Size of the icon image in pixels.
      "iconAnchor": [15, 40], // The coordinates of the "tip" of the icon (relative to its top left corner). Defaults to centering the icon on the point.
      "shadowAnchor": [0, 62], // The coordiantes of the "tip" of the shadow.
      "shadowSize": [50, 64], // Size of the shadow image in pixels.
      "popupAnchor": [0, -35], // The coordinates of the point from which popups will "open", relative to the icon anchor.
      "className": "" // A custom class name to assign to both icon and shadow images. Empty by default.
    }
  },
  "data": [
    // The following data is in GeoJSON format.
    {
      "geometry": {
        "type": "Point", // This is a point on the map. Leave this value the same.
        "coordinates": ["-24.70691524106633", "70.44433593750001"] // The coordinates of the marker on the map.
      },
      "type": "Feature", // This is a map feature. Leave this value the same.
      "properties": {
        // The content of the popup. If all three fields are blank, the popup will not be displayed to the user, even if they try to open it..
        "popTitle": { "en": "" }, // A localized string for the bold title of the popup. Leave blank to hide the title.
        "popupContent": { "en": "" }, // A localized string for the image caption of the popup. Leave blank to hide the content.
        "popupImage": "" // A relative url within public/comments. Leave blank to hide the image.
      },
      "id": 1 // An internal ID. Used to keep track of completed status. Keep these unique within a given feature (they don't have to be unique across features).
    }
    // ... Continue with more points ...
  ]
}
```
