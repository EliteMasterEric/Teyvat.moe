#!/bin/bash

# Create images with ImageMagick, then split them using libvips-tools.
# This is WAY WAY WAY WAY WAY faster because it uses multithreading.
# Seriously, this takes about 4 minutes total, whereas ImageMagick wasn't finished after like 24 hours.

generate_size() {
    base_size=${1}

    width=$(vipsheader -f width MapExtracted.png)
    height=$(vipsheader -f height MapExtracted.png)
    size=$((width > height ? width : height))
    factor=$(bc <<< "scale=10; $base_size / $size")
    
    echo Creating MapExtracted_${base_size}.png...
    if [ ! -f output/MapExtracted_${base_size}.png ]; then
        vips resize MapExtracted.png output/MapExtracted_${base_size}.png $factor
    fi
}

generate_tiles() {
    base_size=${1}

    tile_size=256

    # Split the file.
    echo Splitting MapExtracted_${base_size}.png...
    vips dzsave output/MapExtracted_${base_size}.png output/tiles --layout google --depth onetile --tile-size ${tile_size} --overlap 1 --suffix .png[Q=90]

    # Save as WEBP this time.
    echo Splitting MapExtracted_${base_size}.webp...
    vips dzsave output/MapExtracted_${base_size}.png output/tiles --layout google --depth onetile --tile-size ${tile_size} --overlap 1 --suffix .webp[Q=90]

    # Flatten and reposition.
    # Fetch images up to zoom level 5 + 2 = 7
    for z in {0..5};
    do
        oz=$((${z}+2))
        # Zoom Level 4 = 0-15.
        tile_count=$(((2**${z})-1))
        # tile_offset=$(((2**${z})*2))
        tile_offset=0
        echo Moving ${tile_count} rows of tile from zoom level ${z}, offset by ${tile_offset}...
        for y in $(seq 0 ${tile_count});
        do
            oy=$((${y}+${tile_offset}))
            for x in $(seq 0 ${tile_count});
            do
                ox=$((${x}+${tile_offset}))
                mv output/tiles/${z}/${y}/${x}.png output/Map_${oz}_${ox}_${oy}.png
                mv output/tiles/${z}/${y}/${x}.webp output/Map_${oz}_${ox}_${oy}.webp
            done
        done
    done
}

optimize_images() {
    find ./output -name '*.png' -print0 | xargs -0 -P8 -L1 pngquant --ext .png --force 256
}

mkdir output

# Zoom Level 2
generate_size 512
generate_size 768
# Zoom Level 3
generate_size 1024
generate_size 1536
# Zoom Level 4
generate_size 2048
generate_size 3072
# Zoom Level 5
generate_size 4096
# Current original size.
generate_size 6144
# Zoom Level 6
generate_size 8192 
# Zoom Level 7: Tiles start to become blurry.
generate_size 16384
# Zoom Level 8: Too big to easily generate.
# generate_size 32768

# At each zoom level, each tile is divided in four, and its size (length of the edge, given by the tileSize option) doubles, quadrupling the area.
generate_tiles 8192

# Disabled due to loss of image quality.
# optimize_images
