import os
import requests

# FEATURE_TRANSLATION = {
#   "JS_FST": 
# }

FILE_SCRIPT_OUTPUT = "./YuanshenOutput/Raw_Javascript.js"
FILE_DATA_OUTPUT = "./YuanshenOutput/Raw_Data.json"
URL_YUANSHEN_DATA = "https://yuanshen.site/js/Item_Json.js"
JSON_HEADER = "var orginJsonArr =" 

def make_parent_dirs(path):
  pathdir = os.path.dirname(path)
  os.makedirs(pathdir, exist_ok=True)

def download_to_path(url, path):
  r = requests.get(url, allow_redirects=True)
  if r.status_code != 200:
    print('      [%s ERROR] ACCESSING: %s' % (r.status_code, url))
    return False
  else:
    make_parent_dirs(path)
    open(path, 'wb').write(r.content)
    return True

def get_json_from_file(input):
  with open(input, "r") as f:
    nextLine = False
    for line in f:
      if (nextLine):
        return line

      if (line.strip() == JSON_HEADER):
        nextLine = True
      continue
    return ""

def write_json_to_file(input, output):
  with open(output, "w") as f:
    f.write(get_json_from_file(input))

def main():
  download_to_path(URL_YUANSHEN_DATA, FILE_SCRIPT_OUTPUT)
  write_json_to_file(FILE_SCRIPT_OUTPUT, FILE_DATA_OUTPUT)

main()  