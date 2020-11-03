# assets

This directory contains assets from the game, used to generate maps, marker images, and other graphics used for the main site.

## OriginalMap

The original squares of the world map, extracted from the game files.

## MapExtracted.pdn

A Paint.NET layered image file. The images from OriginalMap, rearranged to match the game. Each image is on its own layer.

## MapExtracted.png

The full game map from MapExtracted.pdn, flattened and saved as a PNG.

## split_map.sh

A script which utilizes ImageMagick to upscale and downscale the world map, then performs cropping to split the world map into individual squares. Since this process creates several thousand images, this is a time-consuming and memory-intensive process.

If the conversion fails due to resource limits, follow this fix: https://stackoverflow.com/questions/31407010/cache-resources-exhausted-imagemagick