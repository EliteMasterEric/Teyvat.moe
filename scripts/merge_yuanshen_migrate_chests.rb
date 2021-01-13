require 'fileutils'
require 'json'
require 'optparse'
require 'object_hash_rb' # Made by yours truely for this project!
require 'pathname'

MIGRATED_DATA_DIR = "./output/migrated/"
YUANSHEN_DATA_DIR = "./output/yuanshen/data/"
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

def read_migrated(region, category, name)
  JSON.parse(File.open("#{MIGRATED_DATA_DIR}/#{region}/#{category}/#{name}.json", 'r:UTF-8').read)
rescue Errno::ENOENT
  nil
end

def read_yuanshen(region)
  path = "#{YUANSHEN_DATA_DIR}/#{region}/chest.json"
  JSON.parse(File.open(path, 'r:UTF-8').read)
rescue Errno::ENOENT => e
  nil
end

def merge_marker_yuanshen_only(input_yuanshen)
  {
    'coordinates' => input_yuanshen['coordinates'],
    'id' => input_yuanshen['id'],
    'importIds' => {
      "yuanshen": input_yuanshen['importIds']['yuanshen'], # Import from Yuanshen.
    },
    "popupTitle" => {
      "zh": input_yuanshen.fetch('popupTitle', {}).fetch('zh', ''),
      "en": "NEW MARKER: #{input_yuanshen.fetch('popupTitle', {}).fetch('en', input_yuanshen['id'][0..(7-1)])}"
    },
    "popupContent" => input_yuanshen.fetch('popupContent', {"en" => ''}),
    "popupMedia" => input_yuanshen.fetch('popupMedia', ''),
    'popupAttribution' => 'Yuanshen.site'
  }
end

def merge_marker_migrated_only(input_migrated)
  input_migrated.merge({
    "popupTitle" => input_migrated.fetch('popupTitle', {}).merge({
      "en" => "MIGRATED MARKER: #{input_migrated.fetch('popupTitle', {}).fetch('en', input_migrated['id'][0..(7-1)])}"
    })
  })
end

def merge_marker(input_migrated, input_yuanshen)
  return {
    'coordinates' => input_migrated['coordinates'],
    'id' => input_migrated['id'],
    'importIds' => input_migrated.fetch('importIds', {}).merge({
      "yuanshen": input_yuanshen['importIds']['yuanshen'], # Import from Yuanshen.
    }),
    "popupTitle" => input_migrated.fetch('popupTitle', {}).merge({
      "zh": input_yuanshen.fetch('popupTitle', {}).fetch('zh', ''),
    }),
    "popupContent" => input_migrated.fetch('popupContent', {}).merge({
      "zh": input_yuanshen.fetch('popupContent', {}).fetch('zh', ''),
    }),
    "popupMedia" => input_migrated.fetch('popupMedia', ''),
    'popupAttribution' => input_migrated.fetch('popupAttribution')
  }
end

def merge_chest_data(input_migrated, input_yuanshen)
  output_json = deep_dup(input_migrated)

  output_json['name']['zh'] = input_yuanshen.fetch('name', {}).fetch('zh', '')

  # Redone to be a hash.
  migrated_markers = input_migrated['data'].map {|x| [x['id'], x]}.to_h
  yuanshen_markers = input_yuanshen['data'].map {|x| [x['id'], x]}.to_h

  output_json['data'] = migrated_markers.map do |id, marker|
    yuanshen_marker = yuanshen_markers[id]
    
    if yuanshen_marker.nil?
      merge_marker_migrated_only(marker)
    else
      output_marker = merge_marker(marker, yuanshen_marker)
      # Remove the marker since we handled it.
      input_yuanshen['data'].reject! {|marker| marker['id'] == id}
  
      output_marker
    end
  end

  return output_json
end

def iterate_chests(options)
  Dir.glob("#{MIGRATED_DATA_DIR}*").each do |region_path|
    region = File.basename(region_path)

    input_yuanshen = read_yuanshen(region)
    # Skip regions with no chest data in Yuanshen.
    next if input_yuanshen.nil?

    puts("Parsing chest data for #{region_path}...")
    Dir.glob("#{MIGRATED_DATA_DIR}/#{region}/chest/*.json").each do |input_full_path|
      input_path = Pathname.new(input_full_path).relative_path_from(Pathname.new(MIGRATED_DATA_DIR))
      
      # Split the path into region, category, and name.
      name, _region, category = parse_pathname(input_path.to_s)
      input_migrated = read_migrated(region, category, name)

      puts("  Chests: #{name}")

      puts(input_yuanshen['data'].length)

      output_json = merge_chest_data(input_migrated, input_yuanshen)

      puts(input_yuanshen['data'].length)

      output_path = File.join(OUTPUT_DIR, input_path)
      write_file(output_path, JSON.pretty_generate(output_json))
    end

    # input_yuanshen now contains the remaining markers.
    write_file(File.join(OUTPUT_DIR, "./#{region}/chest/unsorted.json"), JSON.pretty_generate(input_yuanshen))
  end
end

def print_header(_options)
  puts('=============================')
  puts('   YUANSHEN/MIGRATE MERGER   ')
  puts('=============================')
  puts('')
end

def validate_options(options)
  options
end

def parse_options
  options = {}

  OptionParser.new do |opts|
    opts.banner = 'Usage: merge_yuanshen_migrate.rb [options]'

    # opts.on('-c', '--chests', 'If enabled, process chests only. If disabled, do not process chests at all.') { |i| options[:chests] = i }
  end.parse!

  # Validate and reorganize options.
  validate_options(options)
end

def main
  options = parse_options
  print_header(options)
  iterate_chests(options)
end

main