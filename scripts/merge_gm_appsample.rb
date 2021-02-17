require 'fileutils'
require 'json'
require 'optparse'
require 'object_hash_rb' # Made by yours truely for this project!
require 'pathname'

GENSHINMAP_DATA_DIR = "./output/data/genshinmap/"
APPSAMPLE_DATA_DIR = "./output/data/appsample/"
OUTPUT_DIR = "./output/merged/"

CHEST_CATEGORIES = ["chest"]

def write_file(filepath, data)
  puts("  [INFO]: Writing file #{filepath}...")

  # Create parent directory of file.
  FileUtils.makedirs(File.dirname(filepath))

  File.write(filepath, data)
end

def parse_pathname(input)
  name = File.basename(input, '.json')
  region = input.split('/')[0]
  category = input.split('/')[1]

  [name, region, category]
end

def deep_dup(input)
  Marshal.load(Marshal.dump(input))
end

def read_genshinmap(name)
  JSON.parse(File.open("#{GENSHINMAP_DATA_DIR}/#{name}.json", 'r:UTF-8').read)
rescue Errno::ENOENT
  nil
end

def read_appsample(name)
  JSON.parse(File.open("#{APPSAMPLE_DATA_DIR}/#{name}.json", 'r:UTF-8').read)
rescue Errno::ENOENT
  nil
end

def merge_marker_appsample_only(input_appsample)
  {
    'coordinates' => input_appsample['coordinates'],
    'id' => input_appsample['id'],
    'importIds' => {
      "appsample": input_appsample['importIds']['appsample'],
    },
    "popupTitle" => {
      "en": "NEW MARKER: #{input_appsample['id'][0..(7-1)]}"
    },
    'popupAttribution' => 'AppSample.com'
  }
end

def merge_marker_genshinmap_only(input_genshinmap)
  input_genshinmap.merge({
    "popupTitle" => input_genshinmap.fetch('popupTitle', {}).merge({
      "en" => "OLD MARKER: #{input_genshinmap.fetch('popupTitle', {}).fetch('en', input_genshinmap['id'][0..(7-1)])}"
    })
  })
end

def merge_marker(input_genshinmap, input_appsample)
  if input_genshinmap.nil? then
    # This is a new marker that the old map did not have.
    return merge_marker_appsample_only(input_appsample)
  elsif input_appsample.nil? then
    # This is a marker we made that AppSample didn't have.
    return merge_marker_genshinmap_only(input_genshinmap)
  else
    return {
      'coordinates' => input_genshinmap['coordinates'],
      'id' => input_genshinmap['id'],
      'importIds' => input_genshinmap.fetch('importIds', {}).merge({
        "appsample": input_appsample['importIds']['appsample'],
      }),
      "popupTitle" => input_genshinmap.fetch('popupTitle', {}),
      "popupContent" => input_genshinmap.fetch('popupContent', {}),
      "popupMedia" => input_genshinmap.fetch('popupMedia', ''),
      'popupAttribution' => input_genshinmap.fetch('popupAttribution')
    }
  end
end

def euclidean_distance(gm_marker, as_marker)
  latDistance = gm_marker['coordinates'][0] - as_marker['coordinates'][0]
  lonDistance = gm_marker['coordinates'][1] - as_marker['coordinates'][1]

  hypotenuseSq = (latDistance ** 2) + (lonDistance ** 2)
  hypotenuse = Math.sqrt(hypotenuseSq)
  return hypotenuse
end

def merge_data(input_genshinmap, input_appsample)
  output_json = deep_dup(input_genshinmap)

  genshinmap_markers = input_genshinmap['data'].map {|x| [x['id'], x]}.to_h
  appsample_markers = input_appsample['data'].map {|x| [x['id'], x]}.to_h

  output_json['data'] = genshinmap_markers.map do |gm_id, gm_marker|
    output = [gm_marker, nil]
    lowest_distance = 1
    lowest_id = nil
    appsample_markers.each do |as_id, as_marker|
      distance = euclidean_distance(gm_marker, as_marker)
      if distance < lowest_distance then
        lowest_distance = distance 
        lowest_id = as_id
      end
    end

    if lowest_id != nil then
      output[1] = appsample_markers[lowest_id]
    end

    output
  end.map{|pair| merge_marker(pair[0], pair[1])}

  output_json
end

def read_data(name)
  input_genshinmap = read_genshinmap(name)
  input_appsample = read_appsample(name)

  if input_genshinmap.nil?
    puts("  [WARN]: Could not read genshinmap data: #{name}.json. Skipping...")
    return nil
  end
  if input_appsample.nil?
    puts("  [WARN]: Could not read appsample data: #{name}.json. Skipping...")
    return nil
  end

  [input_genshinmap, input_appsample]
end

def iterate_data(options)
  # For each file in the Migrated data dir...
  Dir.glob("#{GENSHINMAP_DATA_DIR}/**/*.json").each do |input_full_path|
    # The path relative to the chosen input folder.
    input_path = Pathname.new(input_full_path)

    # Split the path into region, category, and name.
    name, region, category = parse_pathname(input_path.to_s)
    next if !options[:chests] && CHEST_CATEGORIES.include?(category)
    next if options[:chests] && !CHEST_CATEGORIES.include?(category)

    # Read the migrated and yuanshen files.
    puts("[INFO]: Reading #{region}/#{category}: #{name}")
    input_genshinmap, input_appsample = read_data(name)
    next if input_genshinmap.nil? || input_appsample.nil?

    # Merge the two JSONs.
    puts("  [INFO]: Merging data...")
    output_json = merge_data(input_genshinmap, input_appsample)
    
    output_path = File.join(OUTPUT_DIR, input_path)
    write_file(output_path, JSON.pretty_generate(output_json))
  end
end

def print_header(_options)
  puts('=========================')
  puts('   GM/APPSAMPLE MERGER   ')
  puts('=========================')
  puts('')
end

def validate_options(options)
  options
end

def parse_options
  options = {}

  OptionParser.new do |opts|
    opts.banner = 'Usage: merge_gm_appsample.rb [options]'
  end.parse!

  # Validate and reorganize options.
  validate_options(options)
end

def main
  options = parse_options
  print_header(options)
  iterate_data(options)
end

main