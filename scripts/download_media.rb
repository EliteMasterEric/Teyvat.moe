#!/bin/ruby
require 'open-uri'
require 'fileutils'
require 'json'
require 'json/next'
require 'optparse'
require 'object_hash_rb' # Made by yours truely for this project!
require 'pathname'


def print_header(_options)
  puts('==================================')
  puts('   MARKER DATA MEDIA DOWNLOADER   ')
  puts('==================================')
  puts('')
end

def write_file(filepath, data)
  # Create parent directory of file.
  FileUtils.makedirs(File.dirname(filepath))

  File.write(filepath, data)
end

def download_file(url, destination)
  download = URI.open(url)
  IO.copy_stream(download, destination)
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
  raise OptionParser::MissingArgument, "No 'output' folder specified." unless options.include?(:output)

  options[:dirmode] = File.directory?(options[:input])

  options
end

def build_media_path(input_full_path)
  parts = input_full_path.split('/').reject(&:empty?).last(3)
  region = parts[0]
  _category = parts[1]
  feature = parts[2].split('.')[0]
  # Return the slug.
  [region, feature].join('/')
end

def download_marker_media(input_json, absolute_name, output)
  output_json = deep_dup(input_json)

  if (/\.(png|jpg)$/.match(output_json['popupMedia'])) then
    partial_id = output_json['id'][0, 7] # First 7 characters.
    output_fileext = File.extname(output_json['popupMedia'])
    output_filename = "#{output}/#{partial_id}#{output_fileext}"
    
    puts("  Downloading image to #{absolute_name}/#{partial_id}")

    download_file(output_json['popupMedia'], output_filename)
    
    output_json['popupMedia'] = "#{absolute_name}/#{partial_id}"
  end

  # return the data.
  output_json
end

def download_feature_media(input_json, absolute_name, output)
  # Duplicate the default feature, and merge our data in.
  output_json = deep_dup(input_json)

  output_json['data'] = input_json['data'].map { |x| download_marker_media(x, absolute_name, output) }

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

  media_path = build_media_path(input)
  output_json = download_feature_media(input_json, media_path, output)

  write_file(File.join(output, File.basename(input)), JSON.pretty_generate(output_json))
end

def parse_options
  options = {}

  OptionParser.new do |opts|
    opts.banner = 'Usage: example.rb [options]'

    opts.on('-i', '--input INPUT', 'Input file/folder to process') { |i| options[:input] = i }
    opts.on('-o', '--output OUTPUT', 'Output folder to place processed files') { |o| options[:output] = o }
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
    input_extname = File.extname(input_path)
    input_basename = File.basename(input_path, input_extname)
    output_path = File.join(options[:output], input_basename)

    # Display what is being processed.
    puts("Processing file #{input_path} into #{output_path}...")
    process_data_file(input_full_path, output_path)
  end
end

def main_filemode(options)
  # Process a single file.
  puts("Processing file #{options[:input]}...")

  # An output path relative to the chosen output folder.
  # Structure will match folder structure of input_path.
  input_extname = File.extname(options[:input])
  input_basename = File.basename(options[:input], input_extname)
  output_path = File.join(options[:output], input_basename)

  # Pipe the full input path to the full output path.
  process_data_file(options[:input], output_path)
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
