# Looks at how the image files are arranged,
# then arranges the data from the legacy JSON to match.

import json
import re
from os import listdir
from os.path import isfile, join

itemDataPath = '../../../_LEGACY/js/ItemData.json'
jsonCommentPattern = re.compile('^ *//(.+)$');
commentNamePattern = re.compile('([0-9]+)_([0-9]+).[a-zA-Z]+')

chestFolders = [
  'challenge',
  'common-chest',
  'dandy',
  'exquisite-chest',
  'luxurious-chest',
  'precious-chest',
  'seelie'
]

def files_in_dir(mypath):
  return [f for f in listdir(mypath) if isfile(join(mypath, f))]

def parse_chest_file(itemData, chestFile):
  chestFileMatch = commentNamePattern.match(chestFile)

  if chestFileMatch == None:
    return None

  featureIndex = int(chestFileMatch.group(1)) # The nth element of the fixedItemData array.
  markerIndex = int(chestFileMatch.group(2)) # The element with the given id.

  for chest in itemData[featureIndex]['features']:
    if chest['id'] == markerIndex:
      return chest

  return None

def parse_chest_folder(itemData, chestFolder): 
  print('Parsing files in %s...' % (chestFolder))
  chestFiles = files_in_dir(chestFolder)
  chestData = []

  for chestFile in chestFiles:
    chestData.append(parse_chest_file(itemData, chestFile))
  
  chestDataJSON = json.dumps(chestData)
  with open('%s/data.json' % chestFolder, 'w') as chestDataFile:
    chestDataFile.write(chestDataJSON)

def main():
  fixedItemData = ''
  
  with open(itemDataPath) as f:
    print ('Reading JSON file...')
    for line in f.readlines():
      result = jsonCommentPattern.match(line)
      if result is not None:
        print('  %s' % (result.group(1)))
      else:
        fixedItemData += line
    print('Done reading JSON file.')

  itemData = json.loads(fixedItemData)

  for chestFolder in chestFolders:
    parse_chest_folder(itemData, chestFolder)

main()