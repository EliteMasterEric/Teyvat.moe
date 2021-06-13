# !/bin/ruby

require "json"
require "fileutils"
require "object_hash_rb"
require "net/http"

# Notes:
# Teyvat: Map ID 2
# Archipelago: Map ID 5
# Map info: https://api-os-takumi-static.mihoyo.com/common/map_user/ys_obc/v1/map/info?map_id=5&app_sn=ys_obc&lang=en-us
# UI I18n EN: https://mi18n-os.mihoyo.com/webstatic/admin/mi18n/bh3_global/20190812_5d51512fdef47/20190812_5d51512fdef47-en-us.json
#             https://mi18n-os.mihoyo.com/webstatic/admin/mi18n/plat_oversea/m04091758461341/m04091758461341-en-us.json
#             https://mi18n-os.mihoyo.com/webstatic/admin/mi18n/hk4e_global/m03311749131601/m03311749131601-en-us.json
# UI I18n ES: https://mi18n-os.mihoyo.com/webstatic/admin/mi18n/bh3_global/20190812_5d51512fdef47/20190812_5d51512fdef47-es-es.json

# Archipelago Markers: https://api-os-takumi-static.mihoyo.com/common/map_user/ys_obc/v1/map/map_anchor/list?map_id=5&app_sn=ys_obc&lang=en-us
# Individual Marker Info: https://api-os-takumi-static.mihoyo.com/common/map_user/ys_obc/v1/map/point/info?app_sn=ys_obc&lang=en-us
#   &map_id=5&point_id=11243

MAP_ID = 5

MAP_ANCHOR_BASE_URL = "https://api-os-takumi-static.mihoyo.com/common/map_user/ys_obc/v1/map/map_anchor/list?app_sn=ys_obc&lang=en-us&map_id="
MAP_MARKER_BASE_URL = "https://api-os-takumi-static.mihoyo.com/common/map_user/ys_obc/v1/map/point/list?app_sn=ys_obc&lang=en-us&map_id="
MAP_MARKER_INFO_URL = "https://api-os-takumi-static.mihoyo.com/common/map_user/ys_obc/v1/map/point/info?app_sn=ys_obc&lang=en-us"

FILE_DATA_OUTPUT = "./output/hoyolab/Raw_Data.json".freeze
FILE_PARSED_OUTPUT = "./output/hoyolab/data/".freeze

# The most barebones of features.
# Any advanced options will be imported,
# and any omitted options will be left as defaults.
DEFAULT_FEATURE = {
  "format" => 2,
  "name" => { # Localized string.
    "en" => "NO NAME"
  },
  "enabled" => true, # Boolean.
  "cluster" => "off", # off, on, or variable.
  "respawn" => "none", # Number of seconds until respawn.
  "icons" => {
    "filter": "andrius", # Image displayed in map controls.
    "base": {
      "marker": true # If true, use a generic marker that displays the Filter icon.
    },
    "done": {
      "marker": true
    }
  },
  "data" => []
}.freeze

DEFAULT_MARKER = {
  "coordinates" => [0, 0],
  "id" => "<BAD>",
  "importIds" => {},
  "popupTitle" => {},
  "popupContent" => {},
  "popupMedia" => "",
  "popupAttribution" => "Hoyolab" # Modified.
}.freeze

def write_file(filepath, data)
  puts("Writing file #{filepath}...")

  # Create parent directory of file.
  FileUtils.makedirs(File.dirname(filepath))

  File.write(filepath, data)
end

# ChilledMeat => chilled-meat
# Unknown20 => unknown-20
def slugify(input)
  input.gsub(/(.)([A-Z]|[0-9]+)/,"\1-\2").downcase
end

def download_to_path(url, path)
  r = Net::HTTP.get_response(URI(url))
  case r
  when Net::HTTPSuccess
    write_file(path, r.body)
  else
    raise format("HTTP: %<code>d error accessing resource %<url>s", code: r.code, url: url)
  end
end

def download_to_memory(url)
  r = Net::HTTP.get_response(URI(url))
  case r
  when Net::HTTPSuccess
    return r.body
  else
    raise format("HTTP: %<code>d error accessing resource %<url>s", code: r.code, url: url)
  end
end

def truncate_number(input)
  # Truncate to 5 digits.
  format("%<input>.5f", input: input).to_f
end

MULTIPLIER = [
  # 0.668132, -0.653547
  1, -1
]
OFFSET = [
  # 35.49, -31.6808 # Teyvat
  64 + 35.49 - 3.13572, -31.6808 - 0.55621 # Archipelago
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

def deep_dup(input)
  Marshal.load(Marshal.dump(input))
end

def parse_json(input, output_folder)
  input_json = JSON.parse(File.open(input, "r:UTF-8").read)

  output_data = {}

  input_json["data"]["label_list"].each do |input_label|
    feature = deep_dup(DEFAULT_FEATURE)
    feature["name"]["en"] = input_label["name"]

    puts("Set up feature: #{input_label["name"]}")

    output_data[input_label["id"]] = feature
  end

  input_json["data"]["point_list"].each do |input_marker|
    marker = deep_dup(DEFAULT_MARKER)
    marker["coordinates"] = [input_marker["x_pos"], input_marker["y_pos"]]
    marker["importIds"]["hoyolab"] = ["#{input_marker["label_id"]}_#{input_marker["id"]}"]

    markerInfoURL = "#{MAP_MARKER_INFO_URL}&map_id=#{MAP_ID}&point_id=#{input_marker["id"]}"

    response_string = download_to_memory(markerInfoURL)
    response_json = JSON.parse(response_string)["data"]["info"]
    puts("Got image url for marker #{MAP_ID}/#{input_marker["id"]}: #{response_json["img"]}")

    marker["popupMedia"] = response_json["img"]

    output_data[input_marker["label_id"]]["data"].push(marker)
  end

  output_data.each do |key, value|
    output_path = File.join(FILE_PARSED_OUTPUT, "#{key}.json")
    puts("Writing feature #{output_path}...")
    write_file(output_path, JSON.pretty_generate(value))
  end
end

def main
  unless File.exist?(FILE_DATA_OUTPUT)
    puts("Could not find file #{FILE_DATA_OUTPUT}. Downloading...")
    hoyolabDataURL = "#{MAP_MARKER_BASE_URL}#{MAP_ID}"
    download_to_path(hoyolabDataURL, FILE_DATA_OUTPUT)
    puts("Download complete.")
  end

  puts("Splitting JSON data...")
  parse_json(FILE_DATA_OUTPUT, FILE_PARSED_OUTPUT)
end

main
