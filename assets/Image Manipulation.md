Various useful scripts for image manipulation.

Use PNGQuant (replacing) on all PNG files in all subfolders.
```
find . -name '*.png' | xargs -0 -P8 -L1 pngquant --ext .png --force 256
```

Replace all JPGs with PNGs.
```
for file in **/**/*.jpg; do echo ${file}; vips copy ${file%.jpg}.jpg ${file%.jpg}.png; rm ${file}; done
```

Create WebPs for all PNGs that don't already have them;
```
shopt -s globstar
for file in **/*.png; do
    if [ ! -f ${file%.png}.webp ]; then
        echo ${file}
        vips copy ${file%.png}.png ${file%.png}.webp
    fi
done
```

Create PNGS for all WebPs;
```
shopt -s globstar
for file in **/*.webp; do
    if [ ! -f ${file%.webp}.png ]; then
        echo ${file}
        vips copy ${file%.webp}.webp ${file%.webp}.png
    fi
done
```

Create smart thumbnails:
```
vipsthumbnail --size=170x170 --smartcrop attention *.webp
```

shopt -s globstar
for file in **/*.jpg; do
    echo ${file}
    vips copy ${file%.jpg}.jpg ${file%.jpg}.png
done