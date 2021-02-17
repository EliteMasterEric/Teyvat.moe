

#!/bin/ruby

require 'fileutils'
require 'optparse'
require 'pathname'


def print_header(_options)
  puts('===========================')
  puts('   BOOKMARKLET GENERATOR   ')
  puts('===========================')
  puts('')
end

def write_file(filepath, data)
  # Create parent directory of file.
  FileUtils.makedirs(File.dirname(filepath))

  File.write(filepath, data)
end

def validate_options(options)
  raise OptionParser::MissingArgument, "No 'input' file specified." unless options.include?(:input)

  options
end

def remove_whitespace(input_data)
  input_data.gsub(/\n+/, "").gsub(/  +/, " ")
end

def wrap_bookmarklet(input_data)
  "javascript:(function(){#{remove_whitespace(input_data)}})();"
end

def process_js_file(input_path)
  input_data = File.open(input_path, 'r:UTF-8').read

  input_extname = File.extname(input_path)
  input_basename = File.basename(input_path, input_extname)
  input_dirname = File.dirname(input_path)
  
  output_path = File.join('./', "#{input_basename}.bookmarklet.js")
  
  puts("Converting '#{input_path}' to a bookmarklet...")
  output_data = wrap_bookmarklet(input_data)
  
  puts("  Writing bookmarklet to '#{output_path}'...")
  write_file(output_path, output_data)
end

def parse_options
  options = {}

  OptionParser.new do |opts|
    opts.banner = 'Usage: example.rb [options]'

    opts.on('-i', '--input INPUT', 'Input file/folder to process') { |i| options[:input] = i }
  end.parse!

  # Validate and reorganize options.
  validate_options(options)
end

def main
  # Parse the options the user provided.
  # Options are stored in a global variable for easy access.
  options = parse_options
  print_header(options)

  process_js_file(options[:input])
end

main
