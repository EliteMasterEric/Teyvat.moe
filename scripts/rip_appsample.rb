# !/bin/ruby

require 'json'
require 'fileutils'
require 'object_hash_rb'
require 'net/http'
require 'spherical_mercator'

# Generate from the AppSample Rip Bookmarklet.
FILE_DATA_OUTPUT = './output/appsample/Raw_Data.json'.freeze
FILE_PARSED_OUTPUT = './output/appsample/data/'.freeze

# The most barebones of features.
# Any advanced options will be imported,
# and any omitted options will be left as defaults.
DEFAULT_FEATURE = {
  'format' => 2,
  'name' => { # Localized string.
    'en' => 'NO NAME'
  },
  'description' => {
    'en' => 'Pulled from AppSample',
  },
  'enabled' => true, # Boolean.
  'cluster' => 'off', # off, on, or variable.
  'respawn' => 'none', # Number of seconds until respawn.
  'icons' => {
    "filter": 'andrius', # Image displayed in map controls.
    "base": {
      "marker": true # If true, use a generic marker that displays the Filter icon.
    },
    "done": {
      "marker": true
    }
  },
  'data' => []
}.freeze

DEFAULT_MARKER = {
  'coordinates' => [0, 0],
  'id' => '<BAD>',
  'importIds' => {},
  'popupTitle' => {},
  'popupContent' => {},
  'popupMedia' => "",
  'popupAttribution' => 'AppSample.com' # Modified.
}.freeze

def truncate_number(input)
  # Truncate to 5 digits.
  format('%<input>.5f', input: input).to_f
end

MULTIPLIER = [
  0.668132, -0.653547
]
OFFSET = [
  35.49, -31.6808
]
MERCATOR = SphericalMercator.new(size: 256, round: false)
ORIGIN = MERCATOR.px([0.0,0.0], 1.0)
puts(ORIGIN)
def reproject_point(point)
  projected = MERCATOR.px([point[1], point[0]], 1.0)
  translated = [(projected[0] - ORIGIN[0]) * MULTIPLIER[0] + OFFSET[0],
    (projected[1] - ORIGIN[1]) * MULTIPLIER[1] + OFFSET[1]]
  return [translated[1], translated[0]]
end
puts(reproject_point([-66.5, 90]))

def convert_coordinates(coordinate)
  #return coordinate
  reprojected = reproject_point(coordinate)
  return [
    truncate_number(reprojected[0]),
    truncate_number(reprojected[1]),
  ];
end

def write_file(filepath, data)
  puts("Writing file #{filepath}...")

  # Create parent directory of file.
  FileUtils.makedirs(File.dirname(filepath))

  File.write(filepath, data)
end

# ChilledMeat => chilled-meat
# Unknown20 => unknown-20
def slugify(input)
  input.gsub(/(.)([A-Z]|[0-9]+)/,'\1-\2').downcase
end

def download_to_path(url, path)
  r = Net::HTTP.get_response(URI(url))
  case r
  when Net::HTTPSuccess
    write_file(path, r.body)
  else
    raise format('HTTP: %<code>d error accessing resource %<url>s', code: r.code, url: url)
  end
end

def extract_json(input, output)
  input_data = File.open(input).read
  next_line = false
  input_data.each_line do |line|
    if next_line
      File.write(output, line)
      break
    end

    next_line = true if line.strip == JSON_HEADER
  end
end

def deep_dup(input)
  Marshal.load(Marshal.dump(input))
end

def migrate_marker_data(input_json)
  if input_json['type'] == "p1" || input_json['type'] == "p2" then
    # Skip routes.
    return nil
  end

  output_json = deep_dup(DEFAULT_MARKER)

  # Move coordinates.
  output_json['coordinates'] = convert_coordinates([input_json['lat'], input_json['lng']])
  
  # Build the ID.
  output_json['id'] = ObjectHash.hash(output_json['coordinates'])

  output_json['importIds']['appsample'] = [input_json['id']]
 
  # Return the result.
  output_json
end

def migrate_feature_data(input_data, feature_name)
  output_json = deep_dup(DEFAULT_FEATURE)

  feature_region = 'unknown'

  output_json['name']['en'] = feature_name

  output_json['data'] = input_data.map do |x|
    migrate_marker_data(x)
  end

  # Return the result.
  output_json
end

def parse_json(input, output_folder)
  input_json = JSON.parse(File.open(input, 'r:UTF-8').read)

  input_json.each do |key, value|
    feature_name = value['name']
    feature_data = value['data']

    output_json = migrate_feature_data(feature_data, feature_name)

    output_path = File.join(output_folder, "#{slugify(feature_name)}.json")
    write_file(output_path, JSON.pretty_generate(output_json))
  end
end

def main
  unless File.exist?(FILE_DATA_OUTPUT)
    puts("Could not find file #{FILE_DATA_OUTPUT}. Downloading...")
    download_to_path(URL_YUANSHEN_DATA, FILE_SCRIPT_OUTPUT)
    extract_json(FILE_SCRIPT_OUTPUT, FILE_DATA_OUTPUT)
    puts("Download complete.")
  end

  puts("Splitting JSON data...")
  parse_json(FILE_DATA_OUTPUT, FILE_PARSED_OUTPUT)
end

main
