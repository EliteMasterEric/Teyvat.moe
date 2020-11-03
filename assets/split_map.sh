#!/bin/bash

generate_size() {
    base_size=${1}
    echo Creating MapExtracted_${base_size}.png...
    convert MapExtracted.png -resize ${base_size}x${base_size}^ output/MapExtracted_${base_size}.png
}

generate_tiles() {
    base_size=${1}
    base_name=${2}
    # tile_width=${base_size}/${tile_x_count}
    tile_width=256
    # tile_height=${base_size}/${tile_y_count}
    tile_height=256
    tile_x_count=$((${base_size}/${tile_width}))
    tile_y_count=$((${base_size}/${tile_height}))

    tile_x_name_start=$((tile_x_count*2))
    tile_y_name_start=$((tile_y_count*2))

    echo Splitting MapExtracted_${base_size}.png into ${tile_x_count} x ${tile_y_count} tiles of size ${tile_width} x ${tile_height}.
    for i in `seq 1 ${tile_x_count}`;
    do
        echo "  Building row ${i}..."
        for j in `seq 1 ${tile_y_count}`;
        do
            echo "  Building column ${j}..."
            xpos=$(($tile_width * (i - 1)))
            ypos=$(($tile_height * (j - 1)))
            xname=$(($tile_x_name_start + (i - 1)))
            yname=$(($tile_y_name_start + (j - 1)))
            
            # The complexity with the naming is such that Leaflet can recognize and orient the map properly.
            convert output/MapExtracted_${base_size}.png -crop ${tile_width}x${tile_height}+${xpos}+${ypos} output/${base_name}_${xname}_${yname}.png 
        done
    done
}

# Create the output folder.
mkdir output

# generate_tile BASE_SIZE CROP_SIZE XPOS YPOS
generate_size 512
generate_size 768
generate_size 1024
generate_size 1536
generate_size 2048
generate_size 3072
generate_size 4096
generate_size 6144 # Current original size.
generate_size 8192 
generate_size 16384 # Blurry, but we need this for the highest zoom level.

# At each zoom level, each tile is divided in four, and its size (length of the edge, given by the tileSize option) doubles, quadrupling the area.

# Zoom level 2 breaks and starts repeating itself, so just block it.
# generate_tiles 256 Map_2
generate_tiles 512 Map_3
generate_tiles 1024 Map_4
generate_tiles 2048 Map_5
generate_tiles 4096 Map_6
generate_tiles 8192 Map_7
generate_tiles 16384 Map_8
