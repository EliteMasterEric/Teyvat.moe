require 'fileutils'
require 'json'
require 'optparse'
require 'pathname'

INPUT_ACHIEVEMENT_FILE = "AchievementExcelConfigData.json"
INPUT_CATEGORY_FILE = "AchievementGoalExcelConfigData.json"
INPUT_REWARD_FILE = "RewardExcelConfigData.json"
INPUT_PATH = "./DimbreathData/ExcelBinOutput/"
OUTPUT_ACHIEVEMENT_NAME = "achievements.json"
OUTPUT_CATEGORY_NAME = "achievement-categories.json"
OUTPUT_PATH = "./output/achievements/"

# You also need to run:
# ruby ./rip_localization.rb --input ./output/achievements --output ./output/achievements-localized/

DEFAULT_ACHIEVEMENT = {
  'id' => 0,
  'category' => 0,
  'title' => { },
  'content' => { }
}.freeze

DEFAULT_CATEGORY = {
  'id' => 0,
  'order' => 0,
  'title' => { },
  'icon' => ""
}.freeze

def write_file(filepath, data)
  puts("  [INFO]: Writing file #{filepath}...")

  # Create parent directory of file.
  FileUtils.makedirs(File.dirname(filepath))

  File.write(filepath, data)
end

def read_json(filepath)
  input_data = File.open(filepath, 'r:UTF-8').read
  input_json = JSON.parse(input_data)
  return input_json
rescue JSON::ParserError => e
  puts("  COULD NOT PARSE JSON: #{e.message}")
  return
end

def deep_dup(input)
  Marshal.load(Marshal.dump(input))
end

def parse_reward_data
  data = read_json(File.join(INPUT_PATH, INPUT_REWARD_FILE))

  output_data = data.map do |entry|
    [entry["RewardId"].to_s, entry["RewardItemList"][0]["ItemCount"]]
  end.to_h

  output_data
end

def parse_achievement_data
  data = read_json(File.join(INPUT_PATH, INPUT_ACHIEVEMENT_FILE))

  puts("Parsing achievement data...")

  reward_data = parse_reward_data

  output_data = data.map do |entry|
    result = deep_dup(DEFAULT_ACHIEVEMENT)

    result["id"] = entry["Id"]
    result["order"] = entry["OrderId"]
    result["category"] = entry["GoalId"]
    result["reward"] = reward_data[entry["FinishRewardId"].to_s]
    result["hidden"] = entry["IsShow"] == "SHOWTYPE_HIDE"
    result["title"]["_code"] = entry["TitleTextMapHash"].to_s # _code needs to be a string
    result["content"]["_code"] = entry["DescTextMapHash"].to_s # _code needs to be a string
    entryParent = entry.fetch("PreStageAchievementId", nil)
    if (!entryParent.nil?) then
      result["parent"] = entryParent
    end

    result
  end

  return output_data
end

def parse_category_data
  data = read_json(File.join(INPUT_PATH, INPUT_CATEGORY_FILE))

  puts("Parsing category data...")

  output_data = data.map do |entry|
    result = deep_dup(DEFAULT_CATEGORY)

    result["id"] = entry.fetch("Id", 0)
    result["order"] = entry["OrderId"]
    result["title"]["_code"] = entry["NameTextMapHash"].to_s # _code needs to be a string
    result["icon"] = entry["IconPath"] # _code needs to be a string

    result
  end

  return output_data
end

def print_header
  puts('============================')
  puts('   DIMBREATH ACHIEVEMENTS   ')
  puts('============================')
  puts('')
end

def main
  print_header

  write_file(File.join(OUTPUT_PATH, OUTPUT_ACHIEVEMENT_NAME), JSON.pretty_generate(parse_achievement_data))
  write_file(File.join(OUTPUT_PATH, OUTPUT_CATEGORY_NAME), JSON.pretty_generate(parse_category_data))
end

main