# !/bin/ruby

require 'json'
require 'fileutils'
require 'object_hash_rb'
require 'net/http'

FILE_SCRIPT_OUTPUT = './output/yuanshen/Raw_Javascript.js'.freeze
FILE_DATA_OUTPUT = './output/yuanshen/Raw_Data.json'.freeze
FILE_PARSED_OUTPUT = './output/yuanshen/data/'.freeze
URL_YUANSHEN_DATA = 'https://yuanshen.site/js/Item_Json.js'.freeze
JSON_HEADER = 'var orginJsonArr ='.freeze

URL_YUANSHEN_IMAGE_BASE = 'https://yuanshen.site/comment_png'.freeze # 0_13.jpg

# The most barebones of features.
# Any advanced options will be imported,
# and any omitted options will be left as defaults.
DEFAULT_FEATURE = {
  'format' => 2,
  'name' => { # Localized string.
    'en' => 'NO NAME'
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
  'popupAttribution' => 'Yuanshen.site' # Modified.
}.freeze

# Keep this in the same order as Raw_Javascript.
# "([_A-Z]+)": '([a-zA-Z0-9]+)',((?:.*[\r\n])*?)  \1   =>   $3  $1: '$2'
FEATURE_TRANSLATION = {
  JS_FST: 'mondstadtAnemoculus',
  JS_YST: 'liyueGeoculus',
  JS_DLK_MD: 'mondstadtShrine',
  JS_DLK_LY: 'liyueShrine',
  JS_JYJJ: 'liyueJueyunChili',
  JS_NSH: 'liyueSilkFlower',
  JS_LLBH: 'liyueGlazeLily',
  JS_GGG: 'mondstadtWolfhook',
  JS_DDL: 'mondstadtCallaLily',
  JS_SXLYH: 'mondstadtCecilia',
  JS_MFMG: 'mondstadtPhilanemoMushroom',
  JS_LLM: 'mondstadtValberry',
  JS_FCJ: 'mondstadtWindwheelAster',
  JS_PGYZ: 'mondstadtDandelionSeed',
  JS_YPS: 'liyueNoctilucousJade',
  JS_SP: 'liyueCorLapis',
  JS_SJK_LY: 'liyueMagicalCrystalChunk',
  JS_BTK_LY: 'liyueWhiteIronChunk',
  JS_SJK_MD: 'mondstadtMagicalCrystalChunk',
  JS_BTK_MD: 'mondstadtWhiteIronChunk',
  JS_YJSW_LY: 'liyueRuinGuard',
  JS_YJLZ_LY: 'liyueRuinHunter',
  JS_LYSS_LY: 'liyueFatuiElectroCicinMage',
  JS_ZWCLR_LY: 'liyueFatuiPyroAgent',
  JS_SYFS_LY: 'liyueAbyssMage',
  JS_DXQQR_LY: 'liyueMitachurl',
  JS_BX_MD: 'mondstadtCommonChest',
  JS_BX_LY: 'liyueCommonChest',
  JS_LLD: 'liyueVioletgrass',
  JS_YJSW_MD: 'mondstadtRuinGuard',
  JS_DXQQR_MD: 'mondstadtMitachurl',
  JS_SYFS_MD: 'liyueAbyssMage',
  JS_LYSS_MD: 'liyueFatuiElectroCicinMage',
  JS_DBT_MD: 'mondstadtTreasureHoarder',
  JS_DBT_LY: 'liyueTreasureHoarder',
  JS_PPH_MD: 'mondstadtWhopperflower',
  JS_PPH_LY: 'liyueWhopperflower',
  JS_XQD_MD: 'mondstadtFatuiSkirmisher',
  JS_XQD_LY: 'liyueFatuiSkirmisher',
  JS_YYLX_LY: 'liyueGeovishapHatchling',
  JS_SLM_MD: 'mondstadtSlime',
  JS_SLM_LY: 'liyueSlime',
  JS_KFZH_MD: 'mondstadtUnknown2',
  JS_KFZH_LY: 'liyueUnknown2',
  JS_QX: 'liyueQingxin',
  JS_MW: 'liyueHorsetail',
  JS_LP: 'liyueLotusHead',
  JS_XL: 'liyueStarconch',
  JS_XDC: 'mondstadtSmallLampGrass',
  JS_BWHHD_MD: 'mondstadtMistFlowerCorolla',
  JS_BWHHD_LY: 'liyueMistFlowerCorolla',
  JS_LYHHR_MD: 'mondstadtFlamingFlowerStamen',
  JS_LYHHR_LY: 'liyueFlamingFlowerStamen',
  JS_DQSJ_MD: 'mondstadtElectroCrystal',
  JS_DQSJ_LY: 'liyueElectroCrystal',
  JS_SBLM_MD: 'mondstadtMoraFerret',
  JS_SBLM_LY: 'liyueMoraFerret',
  JS_FGS_MD: 'mondstadtLuminescentSpine',
  JS_FGS_LY: 'liyueLuminescentSpine',
  JS_JH_MD: 'mondstadtCrystalCore',
  JS_JH_LY: 'liyueCrystalCore',
  JS_JYC_MD: 'mondstadtSnapdragon',
  JS_JYC_LY: 'liyueSnapdragon',
  JS_HDCB_MD: 'mondstadtButterflyWing',
  JS_HDCB_LY: 'liyueButterflyWing',
  JS_PX_MD: 'mondstadtCrab',
  JS_PX_LY: 'liyueCrab',
  JS_QW_MD: 'mondstadtFrog',
  JS_QW_LY: 'liyueFrog',
  JS_TTH_MD: 'mondstadtSweetFlower',
  JS_TTH_LY: 'liyueSweetFlower',
  JS_BH_MD: 'mondstadtMint',
  JS_BH_LY: 'liyueMint',
  JS_SongR_MD: 'mondstadtMatsusake',
  JS_SongR_LY: 'liyueMatsusake',
  JS_ShouR_MD: 'mondstadtRawMeat',
  JS_ShouR_LY: 'liyueRawMeat',
  JS_QR_MD: 'mondstadtFowl',
  JS_QR_LY: 'liyueFowl',
  JS_YR_MD: 'mondstadtRawFish',
  JS_YR_LY: 'liyueRawFish',
  JS_BLB_MD: 'mondstadtRadish',
  JS_BLB_LY: 'liyueRadish',
  JS_HLB_MD: 'mondstadtCarrot',
  JS_HLB_LY: 'liyueCarrot',
  JS_MG_MD: 'mondstadtMushroom',
  JS_MG_LY: 'liyueMushroom',
  JS_XYWB_MD: 'mondstadtLizardTail',
  JS_XYWB_LY: 'liyueLizardTail',
  JS_SG_MD: 'mondstadtPinecone',
  JS_SG_LY: 'liyuePinecone',
  JS_SM_MD: 'mondstadtBerry',
  JS_SM_LY: 'liyueBerry',
  JS_QQR_MD: 'mondstadtUnknown1',
  JS_QQR_LY: 'liyueUnknown1',
  JS_QQSM_MD: 'mondstadtSamachurl',
  JS_QQSM_LY: 'liyueSamachurl',
  JS_DWQ_MD: 'mondstadtUnusualHilichurl',
  JS_DWQ_LY: 'liyueUnusualHilichurl',
  JS_JG_MD: 'liyueViewpoint',
  JS_JG_LY: 'mondstadtViewpoint',
  JS_MJK_MD: 'mondstadtMagicalCrystalChunk',
  JS_MJK_LY: 'liyueMagicalCrystalChunk',
  JS_S_LY: 'liyueBambooShoot',
  JS_NQ_LY: 'liyueLoachPearl',
  JS_YSSP_MD: 'mondstadtMeteoriteShard',
  JS_YSSP_LY: 'liyueMeteoriteShard',
  JS_RLG_MD: 'mondstadtSunsettia',
  JS_RLG_LY: 'liyueSunsettia',
  JS_PG_MD: 'mondstadtApple',
  JS_PG_LY: 'liyueApple',
  JS_FHYS: 'dragonspineCrimsonAgate',
  JS_LXR_MD: 'dragonspineChilledMeat',
  JS_SJ_MD: 'mondstadtBooks',
  JS_SJ_LY: 'liyueBooks',
  JS_SJRW_MD: 'mondstadtWorldQuest',
  JS_SJRW_LY: 'liyueWorldQuest',
  JS_SYWD_MD: 'liyueArtifact',
  JS_SYWD_LY: 'liyueArtifact',
  JS_KDCD_MD: 'mondstadtMineInvestigationPoint',
  JS_KDCD_LY: 'liyueMineInvestigationPoint',
  JS_QD_MD: 'mondstadtBirdEgg',
  JS_QD_LY: 'liyueBirdEgg',
  JS_YZY: 'liyueUnknown5',
  JS_XYKS: 'mondstadtStarsilver',
  JS_SX_MD: 'mondstadtStatue',
  JS_SX_LY: 'liyueStatue',
  JS_CSD_MD: 'mondstadtTeleporter',
  JS_CSD_LY: 'liyueTeleporter',
  JS_MJ_MD: 'mondstadtUnknown4',
  JS_MJ_LY: 'liyueUnknown4',
  JS_FB_MD: 'mondstadtUnknown3',
  JS_FB_LY: 'liyueUnknown3',
  JS_ZWCLR_MD: 'mondstadtFatuiPyroAgent',
}.freeze

def write_file(filepath, data)
  puts("Writing file #{filepath}...")

  # Create parent directory of file.
  FileUtils.makedirs(File.dirname(filepath))

  File.write(filepath, data)
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

def truncate_number(input)
  # Truncate to 5 digits.
  format('%<input>.5f', input: input).to_f
end

def deep_dup(input)
  Marshal.load(Marshal.dump(input))
end

def migrate_marker_data(input_json, yuanshen_code, genshinmap_code, feature_index)
  output_json = deep_dup(DEFAULT_MARKER)

  # Move coordinates.
  output_json['coordinates'] = input_json['geometry']['coordinates'].map { |i| truncate_number(i.to_f) }
  output_json['popupTitle']['en'] = "##{input_json['id']}"
  output_json['popupTitle']['zh'] = input_json['properties']['popTitle']
  output_json['popupContent']['zh'] = input_json['properties']['popupContent']

  # Build the ID.
  output_json['id'] = ObjectHash.hash(output_json['coordinates'])

  output_json['importIds']['yuanshen'] = ["#{feature_index}_#{input_json['id']}"]
  output_json['importIds']['gm_legacy'] = ["#{genshinmap_code}/#{input_json['id']}"]

  output_json['popupMedia'] = "#{URL_YUANSHEN_IMAGE_BASE}/#{feature_index}_#{input_json['id']}.jpg"

  # Return the result.
  output_json
end

def migrate_feature_data(input_json, yuanshen_code, genshinmap_code, feature_index)
  output_json = deep_dup(DEFAULT_FEATURE)

  feature_region = genshinmap_code.split(/(?=[A-Z])/)[0]
  feature_name = genshinmap_code.split(/(?=[A-Z])/)[1..-1].join('')

  output_json['name']['en'] = feature_name

  output_json['data'] = input_json['features'].map do |x|
    migrate_marker_data(x, yuanshen_code, genshinmap_code, feature_index)
  end

  # Return the result.
  output_json
end

def parse_json(input, output_folder)
  input_json = JSON.parse(File.open(input, 'r:UTF-8').read)
  raise 'Input data is not an array.' unless input_json.is_a? Array

  raise 'Keys modified in input data' unless input_json.length == FEATURE_TRANSLATION.length

  (0..(input_json.length - 1)).each do |index|
    feature_code = FEATURE_TRANSLATION.keys[index]
    feature_name = FEATURE_TRANSLATION[feature_code]
    feature_data = input_json[index]

    output_json = migrate_feature_data(feature_data, feature_code, feature_name, index)

    feature_region = feature_name.split(/(?=[A-Z])/)[0]
    feature_subname = feature_name.split(/(?=[A-Z])/)[1..-1].join('')

    output_path = File.join(output_folder, feature_region, "#{feature_subname}.json")
    puts("Writing file #{output_path}...")
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
