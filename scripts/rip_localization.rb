# 1. Load localization files into memory.
#   https://github.com/Dimbreath/GenshinData/tree/master/TextMap
# 2. Find any localization keys with the attribute "_code" attached.
# 3. Insert the value for that code from each language!

require 'fileutils'
require 'json'
require 'optparse'
require 'pathname'

I18N_PATH = "./DimbreathData/TextMap/"
I18N_NAME = "TextMap%s.json"
I18N_LOCALES = {
  "CHS": "zh",
  "DE": "de",
  "EN": "en",
  "ES": "es",
  "FR": "fr",
  "ID": "id",
  # "JA": "ja",
  "JP": "ja",
  # "KO": "ko",
  "KR": "ko",
  "PT": "pt",
  "RU": "ru",
  "TH": "th",
  "VI": "vi",
}

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

def build_i18n_data
  puts("Initializing localization data...")

  i18n_paths = I18N_LOCALES.map {|code, locale| ["#{I18N_PATH}#{I18N_NAME % [code]}", locale]}.to_h

  result = {}

  i18n_paths.keys.each do |path|
    locale = i18n_paths[path]
    puts("Loading locale #{locale}...")

    i18n_data = File.open(path, 'r:UTF-8').read
    i18n_json = JSON.parse(i18n_data)

    i18n_json.each do |key, value|
      result[key] = result.fetch(key, {}).merge({locale => value})
    end
  end
  puts("Done loading #{i18n_paths.keys.length} locales with #{result.keys.length} keys.")

  return result
end

def localize_data_recursive(input_json, i18n_data)
  output_json = deep_dup(input_json)

  if output_json.is_a?(Hash)
    if output_json.has_key?('_code')
      code = output_json['_code']
      puts("Parsing LOCALIZED CODE #{code}...")
      localized = i18n_data[code]
      output_json.merge!(localized)
    else
      puts("Parsing subkeys...")
      output_json.each do |key, value|
        output_json[key] = localize_data_recursive(output_json[key], i18n_data)
      end
    end
  elsif output_json.is_a?(Array)
    puts("Parsing array element...")
    output_json.map! {|value| localize_data_recursive(value, i18n_data)}
  end

  # Else do nothing.
  return output_json
end

def print_header
  puts('============================')
  puts('   DIMBREATH LOCALIZATION   ')
  puts('============================')
  puts('')
end

def process_data_file(input, output, i18n_data)
  begin
    input_data = File.open(input, 'r:UTF-8').read
    input_json = JSON.parse(input_data)
  rescue JSON::ParserError => e
    puts("  COULD NOT PARSE JSON: #{e.message}")
    return
  end

  output_path = File.directory?(output) ? File.join(output, File.basename(input)) : output

  output_json = localize_data_recursive(input_json, i18n_data)

  write_file(output_path, JSON.pretty_generate(output_json))
end

def validate_options(options)
  raise OptionParser::MissingArgument, "No 'input' file or folder specified." unless options.include?(:input)
  raise OptionParser::MissingArgument, "No 'output' file or folder specified." unless options.include?(:output)

  options[:dirmode] = File.directory?(options[:input])

  options
end

def parse_options
  options = {}

  OptionParser.new do |opts|
    opts.banner = 'Usage: example.rb [options]'

    opts.on('-i', '--input INPUT', 'Input file/folder to process') { |i| options[:input] = i }
    opts.on('-o', '--output OUTPUT', 'Output file/folder to place processed files') { |o| options[:output] = o }
  end.parse!

  # Validate and reorganize options.
  validate_options(options)
end

def main_dirmode(options, i18n_data)
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
    process_data_file(input_full_path, output_path, i18n_data)
  end
end

def main_filemode(options, i18n_data)
  # Process a single file.
  puts("Processing file #{options[:input]}...")
  # Pipe the full input path to the full output path.
  process_data_file(options[:input], options[:output], i18n_data)
end

def main
  # Parse the options the user provided.
  # Options are stored in a global variable for easy access.
  options = parse_options
  print_header

  i18n_data = build_i18n_data

  if options[:dirmode]
    main_dirmode(options, i18n_data)
  else
    main_filemode(options, i18n_data)
  end
end

main
