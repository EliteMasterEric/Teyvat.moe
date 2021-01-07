# scripts

This directory contains useful scripts for maintaining the map.

## split_map.sh

Uses VIPS to resize MapExtracted.png to various sizes, then split it into map tiles, then rename the tiles to be used by Leaflet.

## make_media_local.py

Trawls though all the JSON files in `./src/data/features/`, finds any Imgur URLs, downloads the image to the appropriate folder, then modifies the JSON data to match.

## chest_folder_sorter.py

OUTDATED AND NOT USEFUL ANYMORE: Script which uses the locations of comment images to categorize chest data into JSON files.

## migrate_marker_data.rb

Converts old marker data to MSFv2, while maintaining references to allow for old user profiles to migrate.

## rip_yuanshen.rb

Rips Yuanshen marker data and converts it to MSFv2, while maintaining Chinese description data.

## merge_yuanshen_migrate.rb

Combines data from migrate_marker_data.rb and rip_yuanshen.rb. Any markers with the same coordinates will be seamlessly merged, and any markers with no corresonding marker in one or the other will be annotated for review.