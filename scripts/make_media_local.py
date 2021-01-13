#!/bin/python3
# Travels through each JSON file in the src/data folder,
# finds markers whose media is an external image,
# downloads the image to public/comments, and rewrites the URL to be local.

import json
import re
import requests
from copy import deepcopy
from os import listdir, makedirs
from os.path import isfile, join, isdir, dirname

featureDataBasePath = '../src/data/features/'
publicCommentBasePath = '../public/comments'
jsonPattern = re.compile('(.+)\.(json)')
imageURLPattern = re.compile('((?:https:\/\/i\.imgur\.com\/(?:.+?))|https:\/\/yuanshen\.site\/comment_png\/)\.(png|jpg)')

def make_parent_dirs(path):
  pathdir = dirname(path)
  makedirs(pathdir, exist_ok=True)

def files_in_dir(mypath):
  return [f for f in listdir(mypath) if isfile(join(mypath, f))]

def subdirs_in_dir(mypath):
  return [f for f in listdir(mypath) if isdir(join(mypath, f))]

def download_to_path(url, path):
  r = requests.get(url, allow_redirects=True)
  if r.status_code != 200:
    print('      [%s ERROR] ACCESSING: %s' % (r.status_code, url))
    return False
  else:
    make_parent_dirs(path)
    open(path, 'wb').write(r.content)
    return True

def parse_marker_for_media(marker, region, featureName):
  mediaURL = marker['properties']['popupMedia']
  mediaExternalMatch = imageURLPattern.match(mediaURL)
  if mediaExternalMatch is not None:
    markerId = marker['id'][0:7] # First 7 characters.
    mediaExternalBase = mediaExternalMatch.group(1) 
    mediaExternalExt = mediaExternalMatch.group(2)

    # Imgur will provide a file of the proper type based on the extension requested.
    mediaURLPNG = '%s.%s' % (mediaExternalBase, mediaExternalExt)

    mediaOutputBase = '%s/%s/%s' % (region, featureName, markerId)
    mediaOutput = '%s/%s' % (publicCommentBasePath, mediaOutputBase)
    mediaOutputPath = '%s.%s' % (mediaOutput, mediaExternalExt)
    if download_to_path(mediaURLPNG, mediaOutputPath):
      marker['properties']['popupMedia'] = mediaOutputBase

  return marker


def parse_json_for_media(path, region, featureName):
  with open(path, 'r') as fr:
    featureData = json.load(fr)
    featureDataNew = deepcopy(featureData)
    for i in range(0, len(featureDataNew['data'])):
      marker = featureDataNew['data'][i]
      featureDataNew['data'][i] = parse_marker_for_media(marker, region, featureName)
    if (featureData == featureDataNew):
      print('      no change')
    else:
      print('      ***DATA MODIFIED, EDITING JSON***')
      with open(path, 'w') as fw:
        json.dump(featureDataNew, fw, indent=2)

def main():
  for region in subdirs_in_dir(featureDataBasePath):
    print('%s' % region)
    regionPath = "%s/%s" % (featureDataBasePath, region)
    for category in subdirs_in_dir(regionPath):
      print('  %s' % category)
      categoryPath = "%s/%s" % (regionPath, category)
      for feature in files_in_dir(categoryPath):
        # If this is JSON...
        jsonMatch = jsonPattern.match(feature)
        if jsonMatch is not None:
          featureName = jsonMatch.group(1)
          print('    %s' % featureName)
          featurePath = "%s/%s" % (categoryPath, feature)
          parse_json_for_media(featurePath, region, featureName)

main()
