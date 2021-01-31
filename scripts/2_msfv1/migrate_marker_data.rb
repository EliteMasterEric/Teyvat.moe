#!/bin/ruby

require 'fileutils'
require 'json'
require 'optparse'
require 'object_hash_rb' # Made by yours truely for this project!
require 'pathname'

# The most barebones of features.
# Any advanced options will be imported,
# and any omitted options will be left as defaults.
DEFAULT_FEATURE = {
  'format' => 2,
  'name' => { # Localized string.
    'en' => 'NO NAME'
  },
  'description' => { # Localized string.
    'en' => ''
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
  'popupAttribution' => 'Unknown'
}.freeze

def print_header(_options)
  puts('==========================')
  puts('   MARKER DATA MIGRATOR   ')
  puts('==========================')
  puts('')
end

def write_file(filepath, data)
  # Create parent directory of file.
  FileUtils.makedirs(File.dirname(filepath))

  File.write(filepath, data)
end

def truncate_number(input)
  # Truncate to 5 digits.
  format('%<input>.5f', input: input).to_f
end

def deep_dup(input)
  Marshal.load(Marshal.dump(input))
end

def validate_options(options)
  raise OptionParser::MissingArgument, "No 'input' file or folder specified." unless options.include?(:input)
  raise OptionParser::MissingArgument, "No 'output' file or folder specified." unless options.include?(:output)

  options[:dirmode] = File.directory?(options[:input])

  options
end

def build_absolute_name(input_full_path)
  parts = input_full_path.split('/').reject(&:empty?).last(3)
  region = parts[0]
  _category = parts[1]
  feature = parts[2].split('.')[0]
  # Return the slug.
  [region, *feature.split('-').map(&:capitalize)].join
end

def migrate_marker_imports(input_json, output_json, absolute_name, options)
  # Import from MDFv1
  output_json['importIds']['gm_legacy'] = ["#{absolute_name}/#{input_json['id']}"]

  # Return the final output.
  output_json
end

def migrate_marker(input_json, absolute_name, options)
  output_json = deep_dup(DEFAULT_MARKER)

  # Drop keys: type, geometry/type

  # Features we can move without formatting changes, if they have content.
  %w[popupTitle popupContent].each { |x| output_json[x] = input_json['properties'][x] unless input_json['properties'].fetch(x, {'en' => ''})['en'].empty? }
  %w[popupMedia].each { |x| output_json[x] = input_json['properties'][x] if input_json['properties'][x] }

  # Move coordinates.
  output_json['coordinates'] = input_json['geometry']['coordinates'].map { |i| truncate_number(i) }

  # Build the ID.
  output_json['id'] = ObjectHash.hash(output_json['coordinates'])

  # return the data.
  migrate_marker_imports(input_json, output_json, absolute_name, options)
end

def migrate_feature(input_json, absolute_name, options)
  # Duplicate the default feature, and merge our data in.
  output_json = deep_dup(DEFAULT_FEATURE)

  # Features we can move without formatting changes.
  # Features not present are left as default with the 'if' statement.
  %w[name description respawn enabled icons].each { |x| output_json[x] = input_json[x] if input_json[x] }
  # No longer a boolean.
  output_json['cluster'] = input_json['cluster'] ? 'on' : 'off'

  output_json['data'] = input_json['data'].map { |x| migrate_marker(x, absolute_name, options) }

  # Return data.
  output_json
end

def process_data_file(input, output, options)
  begin
    input_json = JSON.parse(File.open(input, 'r:UTF-8').read)
  rescue JSON::ParserError => e
    puts("  COULD NOT PARSE JSON: #{e.message}")
    return
  end

  output_path = File.directory?(output) ? File.join(output, File.basename(input)) : output

  if input_json['format'] == DEFAULT_FEATURE['format']
    if options[:copy] then
      puts("  Format up-to-date, copying...")
      write_file(output_path, JSON.pretty_generate(input_json))
      return
    else
      puts("  Format up-to-date, skipping...")
      return
    end
  end

  absolute_name = build_absolute_name(input)
  output_json = migrate_feature(input_json, absolute_name, options)

  write_file(output_path, JSON.pretty_generate(output_json))
end

def parse_options
  options = {}

  OptionParser.new do |opts|
    opts.banner = 'Usage: example.rb [options]'

    opts.on('-i', '--input INPUT', 'Input file/folder to process') { |i| options[:input] = i }
    opts.on('-o', '--output OUTPUT', 'Output file/folder to place processed files') { |o| options[:output] = o }
    opts.on('-c', '--copy', 'Copy files which are new. Otherwise, ignore files which are new.') { |c| options[:copy] = c }
  end.parse!

  # Validate and reorganize options.
  validate_options(options)
end

def main_dirmode(options)
  # Process all files in directory.
  puts("Processing directory #{options[:input]}...")
  Dir.glob("#{options[:input]}/**/*.json").each do |input_full_path|
    # The path relative to the chosen input folder.
    input_path = Pathname.new(input_full_path).relative_path_from(Pathname.new(options[:input]))
    # An output path relative to the chosen output folder.
    # Structure will match folder structure of input_path.
    output_path = File.join(options[:output], input_path)

    # Display what is being processed.
    puts("Processing file #{input_path} into #{output_path}...")
    process_data_file(input_full_path, output_path, options)
  end
end

def main_filemode(options)
  # Process a single file.
  puts("Processing file #{options[:input]}...")
  # Pipe the full input path to the full output path.
  process_data_file(options[:input], options[:output], options)
end

def main
  # Parse the options the user provided.
  # Options are stored in a global variable for easy access.
  options = parse_options
  print_header(options)

  if options[:dirmode]
    main_dirmode(options)
  else
    main_filemode(options)
  end
end

main
