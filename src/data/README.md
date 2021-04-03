# data

This folder contains JSON data [in GeoJSON format](https://leafletjs.com/examples/geojson/), with coordinates and metadata on each Feature landmark to be displayed on the map.

Each category of landmark is given its own JSON file for ease of editing.

## data/features

Contains JSON data describing markers, with locations of features.

JSON files will be parsed and included in the map, and placed into the options pane based on region and category.

Note that `md` files will be ignored, so they can be used to provide notes as necessary.

### feature data format:

See `scripts/Documentation - MSFv2.md` for information on the file structure.
