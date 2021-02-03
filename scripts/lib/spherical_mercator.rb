require_relative 'spherical_mercator/version'

class SphericalMercator
  
  attr_reader :options
  attr_accessor :size, :round

  # Closures including constants and other precalculated values.

  EPSLN = 1.0e-10
  D2R = Math::PI / 180
  R2D = 180.0 / Math::PI
  # 900913 properties.
  A = 6_378_137.0
  MAX_EXTENT = 20_037_508.342_789_244

  attr_accessor :cache

  attr_accessor :ac, :bc, :cc, :zc

  # SphericalMercator constructor: precaches calculations
  # for fast tile lookups.
  def initialize(opts = {})
    @cache = {}
    @options = opts || {}

    self.size = (options[:size] || 256).to_f
    # Whether to round output values for integer zoom levels. Defaults to true.
    self.round = (options[:round].nil?) ? true : options[:round]

    if cache[size].nil?
      size = self.size
      c = cache[self.size] = {}
      c['Bc'] = []
      c['Cc'] = []
      c['zc'] = []
      c['Ac'] = []

      30.times do
        c['Ac'].push(size.to_i)
        c['Bc'].push(size / 360)
        c['Cc'].push(size / (2 * Math::PI))
        c['zc'].push((size / 2).to_i)

        size *= 2
      end
    end

    @ac = cache[self.size]['Ac']
    @bc = cache[self.size]['Bc']
    @cc = cache[self.size]['Cc']
    @zc = cache[self.size]['zc']
  end

  # function isFloat(n)
  def float?(value)
    number = Float(value)
    number % 1 != 0
  rescue ArgumentError
    false
  end

  # Convert lon lat to screen pixel value
  #
  # - `ll` {Array} `[lon, lat]` array of geographic coordinates.
  # - `zoom` {Number} zoom level.
  def px(lon_lat, zoom)
    if float?(zoom) || !self.round
      size = @size * (2**zoom)
      d = size / 2
      bc = (size / 360)
      cc = (size / (2 * Math::PI))
      ac = size
      f = [[Math.sin(D2R * lon_lat[1]), -0.9999].max, 0.9999].min
      puts(Math.sin(D2R * lon_lat[1]))
      x = d + lon_lat[0] * bc
      puts(x)
      y = d + 0.5 * Math.log((1 + f) / (1 - f)) * -cc
      (x > ac) && (x = ac)
      (y > ac) && (y = ac)
      # (x < 0) && (x = 0)
      # (y < 0) && (y = 0)
      [x, y]
    else
      d = @zc[zoom]
      # JS: Math.min(Math.max(Math.sin(D2R * ll[1]), -0.9999), 0.9999)
      f = [[Math.sin(D2R * lon_lat[1]), -0.9999].max, 0.9999].min
      x = (d + lon_lat[0] * @bc[zoom]).round
      y = (d + 0.5 * Math.log((1 + f) / (1 - f)) * (-@cc[zoom])).round
      (x > @ac[zoom]) && (x = @ac[zoom])
      (y > @ac[zoom]) && (y = @ac[zoom])

      # (x < 0) && (x = 0)
      # (y < 0) && (y = 0)
      [x, y]
    end
  end

  # Convert screen pixel value to lon lat
  #
  # - `px` {Array} `[x, y]` array of geographic coordinates.
  # - `zoom` {Number} zoom level.
  def ll(px, zoom)
    if float?(zoom)
      size = @size * (2**zoom)
      bc = (size / 360)
      cc = (size / (2 * Math::PI))
      zc = size / 2
      g = (px[1] - zc) / -cc
      lon = (px[0] - zc) / bc
      lat = R2D * (2 * Math.atan(Math.exp(g)) - 0.5 * Math::PI)
      [lon, lat]
    else
      g = (px[1] - @zc[zoom]) / (-@cc[zoom])
      lon = (px[0] - @zc[zoom]) / @bc[zoom]
      lat = R2D * (2 * Math.atan(Math.exp(g)) - 0.5 * Math::PI)
      [lon, lat]
    end
  end

  # Convert tile xyz value to bbox of the form `[w, s, e, n]`
  #
  # - `x` {Number} x (longitude) number.
  # - `y` {Number} y (latitude) number.
  # - `zoom` {Number} zoom.
  # - `tms_style` {Boolean} whether to compute using tms-style.
  # - `srs` {String} projection for resulting bbox (WGS84|900913).
  # - `return` {Array} bbox array of values in form `[w, s, e, n]`.
  def bbox(x, y, zoom, tms_style = false, srs = 'WGS84')
    # Convert xyz into bbox with srs WGS84
    y = ((2**zoom) - 1) - y if tms_style

    lower_left = [x * @size, (y + 1) * @size] # lower left
    upper_right = [(x + 1) * @size, y * @size] # upper right

    bbox = ll(lower_left, zoom).concat(ll(upper_right, zoom))

    # If web mercator requested reproject to 900913.
    if srs == '900913'
      convert(bbox, '900913')
    else
      bbox
    end
  end

  # Convert bbox to xyx bounds
  #
  # - `bbox` {Number} bbox in the form `[w, s, e, n]`.
  # - `zoom` {Number} zoom.
  # - `tms_style` {Boolean} whether to compute using tms-style.
  # - `srs` {String} projection of input bbox (WGS84|900913).
  # - `@return` {Object} XYZ bounds containing minX, maxX, minY, maxY properties
  def xyz(bbox, zoom, tms_style = false, srs = 'WGS84')
    # If web mercator provided reproject to WGS84.
    bbox = convert(bbox, 'WGS84') if srs == '900913'

    lower_left = [bbox[0], bbox[1]] # lower left
    upper_right = [bbox[2], bbox[3]] # upper right
    px_ll = px(lower_left, zoom)
    px_ur = px(upper_right, zoom)

    # Y = 0 for XYZ is the top hence minY uses px_ur[1].
    x = [(px_ll[0] / @size).floor, ((px_ur[0] - 1) / @size).floor]
    y = [(px_ur[1] / @size).floor, ((px_ll[1] - 1) / @size).floor]

    bounds = {
      minX: x.min < 0 ? 0 : x.min, # JS: Math.min.apply(Math, x)
      minY: y.min < 0 ? 0 : y.min,
      maxX: x.max,
      maxY: y.max
    }

    if tms_style
      tms = {
        minY: ((2**zoom) - 1) - bounds[:maxY],
        maxY: ((2**zoom) - 1) - bounds[:minY]
      }

      bounds[:minY] = tms[:minY]
      bounds[:maxY] = tms[:maxY]
    end

    bounds
  end

  # Convert projection of given bbox.
  #
  # - `bbox` {Number} bbox in the form `[w, s, e, n]`.
  # - `to` {String} projection of output bbox (WGS84|900913). Input bbox
  #   assumed to be the "other" projection.
  # - `@return` {Object} bbox with reprojected coordinates.
  def convert(bbox, to = 'WGS84')
    if to == '900913'
      forward(bbox.slice(0, 2)).concat(forward(bbox.slice(2, 4)))
    else
      inverse(bbox.slice(0, 2)).concat(inverse(bbox.slice(2, 4)))
    end
  end

  # Convert lon/lat values to 900913 x/y.
  def forward(lon_lat)
    xy = [
      A * lon_lat[0] * D2R,
      A * Math.log(Math.tan((Math::PI * 0.25) + (0.5 * lon_lat[1] * D2R)))
    ]

    # if xy value is beyond maxextent (e.g. poles), return maxextent.
    (xy[0] > MAX_EXTENT) && (xy[0] = MAX_EXTENT)
    (xy[0] < -MAX_EXTENT) && (xy[0] = -MAX_EXTENT)
    (xy[1] > MAX_EXTENT) && (xy[1] = MAX_EXTENT)
    (xy[1] < -MAX_EXTENT) && (xy[1] = -MAX_EXTENT)
    xy
  end

  # Convert 900913 x/y values to lon/lat.
  def inverse(xy)
    [
      (xy[0] * R2D / A),
      ((Math::PI * 0.5) - 2.0 * Math.atan(Math.exp(-xy[1] / A))) * R2D
    ]
  end
end
