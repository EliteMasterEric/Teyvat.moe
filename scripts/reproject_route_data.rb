#!/bin/ruby

require 'fileutils'
require 'json'
require 'json/next'
require 'optparse'
require 'object_hash_rb' # Made by yours truely for this project!
require 'pathname'

require_relative 'lib/spherical_mercator'


def print_header(_options)
  puts('================================')
  puts('   MARKER DATA DEMERCATORFIER   ')
  puts('================================')
  puts('')
end

MULTIPLIER = [
  0.5, -0.5
]
OFFSET = [
  0.15, -0.1
]
MERCATOR = SphericalMercator.new(size: 256, round: false)
ORIGIN = MERCATOR.px([0.0,0.0], 1.0)
def reproject_point(point)
  projected = MERCATOR.px([point[1], point[0]], 1.0)
  translated = [(projected[0] - ORIGIN[0]) * MULTIPLIER[0] + OFFSET[0],
    (projected[1] - ORIGIN[1]) * MULTIPLIER[1] + OFFSET[1]]
  return [translated[1], translated[0]]
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

def migrate_route(input_json, absolute_name)
  output_json = deep_dup(input_json)

  # Move coordinates.
  output_json['coordinates'] = input_json['coordinates'].map {|i| reproject_point(i).map{|j| truncate_number(j)} }

  # Build the ID.
  output_json['id'] = ObjectHash.hash(output_json['coordinates'])

  # Save the old ID.
  # output_json['importIds']['gm_msfv2'] = input_json['importIds'].fetch('gm_msfv2', []).push(input_json['id'])

  # return the data.
  output_json
end

def migrate_routes(input_json, absolute_name)
  # Duplicate the default feature, and merge our data in.
  output_json = deep_dup(input_json)

  output_json['data'] = input_json['data'].map { |x| migrate_route(x, absolute_name) }

  # Return data.
  output_json
end

def process_data_file(input, output)
  begin
    input_data = File.open(input, 'r:UTF-8').read
    input_json = HANSON.parse(input_data)
  rescue JSON::ParserError => e
    puts("  COULD NOT PARSE JSON: #{e.message}")
    return
  end

  output_path = File.directory?(output) ? File.join(output, File.basename(input)) : output

  absolute_name = build_absolute_name(input)
  output_json = migrate_routes(input_json, absolute_name)

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
  Dir.glob("#{options[:input]}/**/*.{json,jsonc}").each do |input_full_path|
    # The path relative to the chosen input folder.
    input_path = Pathname.new(input_full_path).relative_path_from(Pathname.new(options[:input]))
    # An output path relative to the chosen output folder.
    # Structure will match folder structure of input_path.
    output_path = File.join(options[:output], input_path)

    # Display what is being processed.
    puts("Processing file #{input_path} into #{output_path}...")
    process_data_file(input_full_path, output_path)
  end
end

def main_filemode(options)
  # Process a single file.
  puts("Processing file #{options[:input]}...")
  # Pipe the full input path to the full output path.
  process_data_file(options[:input], options[:output])
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
