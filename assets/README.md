# assets

This directory contains raw assets.

## OriginalMap

The original squares of the world map, extracted from the game files.

## MapExtracted.pdn

A Paint.NET layered image file. The images from OriginalMap, rearranged to match the game. Each image is on its own layer.

## MapExtracted.png

The full game map from MapExtracted.pdn, flattened and saved as a PNG.

## split_map.sh

Legacy script which utilizes ImageMagick to upscale and crop the world map into individual squares.

DO NOT USE, it's far too slow.

## split_map_vips.sh

Script which utilizes VIPS to upscale and crop the world map into individual squares. Much faster than the ImageMagick version.

## sorter.py

Script used to sort chest JSON into individual files based on the file names in the chest comment image folders.

# make_media_local.py

Script which trawls all data files, locates image file paths, downloads the file to the `/public/comments` folder, and adjusts the `popupMedia` field accordingly.
