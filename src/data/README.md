# data

This folder contains JSON data [in GeoJSON format](https://leafletjs.com/examples/geojson/), with coordinates and metadata on each Feature landmark to be displayed on the map.

Each category of landmark is given its own JSON file for ease of editing.

## JSONC

JSONC files use what some refer to as an extension/flavor of the JSON spec, and others refer to as a violation.

JSONC files add the following additions to the spec:

- Commas after the last list element or object property will be ignored rather than causing a parser error.
- JavaScript-style comments (single line `//` and/or multi-line `/* */`) are supported for the purposes of documentation, and will be stripped when parsing.
