# Ruby port of Mapbox Spherical Mercator
[![Gem Version](https://badge.fury.io/rb/spherical_mercator.svg)](http://badge.fury.io/rb/spherical_mercator)
[![Build Status](https://travis-ci.org/nbulaj/spherical_mercator.svg?branch=master)](https://travis-ci.org/nbulaj/spherical_mercator)
[![Coverage Status](https://coveralls.io/repos/github/nbulaj/spherical_mercator/badge.svg)](https://coveralls.io/github/nbulaj/spherical_mercator)
[![License](http://img.shields.io/badge/license-MIT-brightgreen.svg)](#license)

Spherical Mercator gem is a port of [Mapbox sphericalmercator JS lib](https://github.com/mapbox/sphericalmercator) that provides projection math
for converting between mercator meters, screen pixels (of 256x256 or configurable-size tiles), and latitude/longitude.

## Requirements

* Ruby >= 2.0

## Installation

Simple:

`gem install spherical_mercator`

For Gemfile:

`gem 'spherical_mercator'`

## API

_NOTE_: API description copied from the original repo.

Some datatypes are assumed to be arrays: `ll` is `[lon, lat]`, `xy` and `px` are
`[x, y]`.

```ruby
# By default, precomputes up to z30
mercator = SphericalMercator.new(size: 256)
# Whether to round pixel values at integer zoom levels. Defaults to true.
mercator = SphericalMercator.new(round: false)
```

### `px(lon_lat, zoom)`

Convert lon, lat to screen pixel x, y from 0, 0 origin, at a certain zoom level.
The inverse of `ll`

Screen pixel values are rounded, unless the zoom level is a floating point value. To disable rounding on integer zoom levels, specify `round: false` when creating the SphericalMercator.

### `ll(px, zoom)`

Convert screen pixel value to lon, lat, at a certain zoom level. The inverse
of `px`

### `bbox(x, y, zoom, tms_style, srs)`

Convert tile xyz value to bbox of the form `[west, south, east, north]`

* `x` {Number} x (longitude) number.
* `y` {Number} y (latitude) number.
* `zoom` {Number} zoom.
* `tms_style` {Boolean} whether to compute using tms-style. (optional, default `false`)
* `srs` {String} projection for resulting bbox ('WGS84'|'900913'). (optional, default 'WGS84')

Returns bbox array of values in form `[west, south, east, north]`.

### `xyz(bbox, zoom, tms_style, srs)`

Convert bbox to xyz bounds

* `bbox` {Number} bbox in the form `[west, south, east, north]`.
* `zoom` {Number} zoom.
* `tms_style` {Boolean} whether to compute using tms-style. (optional, default `false`)
* `srs` {String} projection of input bbox ('WGS84'|'900913'). (optional, default 'WGS84')

Returns `Hash` object (`{...}`) for XYZ bounds containing `:minX`, `:maxX`, `:minY`, `:maxY` properties.

### `convert(bbox, to)`

Convert bbox from 900913 to WGS84 or vice versa

* `bbox` {Number} bbox in the form `[west, south, east, north]`.
* `to` {String} projection of resulting bbox ('WGS84'|'900913'). (optional, default 'WGS84')

Returns bbox array of values in form `[west, south, east, north]`.

### `forward(lon_lat)`

Convert lon, lat values (must be an array like `[lon, lat]`) to mercator x, y

### `inverse(xy)`

Convert mercator x, y values (`xy` must be an array like `[x, y]`) to lon, lat

## Contributing

You are very welcome to help improve spherical_mercator if you have suggestions for features that other people can use.

To contribute:

1. Fork the project.
2. Create your feature branch (`git checkout -b my-new-feature`).
3. Implement your feature or bug fix.
4. Add documentation for your feature or bug fix.
5. Run <tt>rake doc:yard</tt>. If your changes are not 100% documented, go back to step 4.
6. Add tests for your feature or bug fix.
7. Run `rake` to make sure all tests pass.
8. Commit your changes (`git commit -am 'Add new feature'`).
9. Push to the branch (`git push origin my-new-feature`).
10. Create new pull request.

Thanks.

## License

Spherical Mercator gem is released under the [MIT License](http://www.opensource.org/licenses/MIT).

Copyright (c) 2017 Nikita Bulai (bulajnikita@gmail.com) and [original lib authors](https://github.com/mapbox/sphericalmercator/graphs/contributors).
