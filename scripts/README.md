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

Combines data from migrate_marker_data.rb and rip_yuanshen.rb. Any markers with the same coordinates will be seamlessly merged.

Markers with no corresonding marker in Yuanshen will be annotated as MIGRATED MARKER: #ID. You'll have to do manual cleanup to check whether this is a marker Yuanshen omitted or a marker that has been moved by Yuanshen.

Markers with no corresonding marker in Migrated will be annotated as NEW MARKER: #ID. You'll have to do manual cleanup to see if this is a new marker or an old marker that was moved.

【普通宝箱】: Common Chest
【精致宝箱】: Exquisite Chest
【珍贵宝箱】: Precious Chest
【华丽宝箱】: Luxurious Chest
【绯红玉髓】: Crimson Agate

## MapGenie

Paste the FULL contents of `window.store.getState()` into `output/mapgenie/InputData.json`