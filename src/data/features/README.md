# data/features

Contains JSON data describing markers, with locations of features.

JSON files will be parsed and included in the map, and placed into the options pane based on region and category.

Note that `md` files will be ignored, so they can be used to provide notes as necessary.

## JSONC

JSONC files use what some refer to as an extension/flavor of the JSON spec, and others refer to as a violation.

JSONC files add the following additions to the spec:

- Commas after the last list element or object property will be ignored rather than causing a parser error.
- JavaScript-style comments (single line `//` and/or multi-line `/* */`) are supported for the purposes of documentation, and will be stripped when parsing.

## feature data format:

See `scripts/Documentation - MSFv2.md` for information on the file structure.
