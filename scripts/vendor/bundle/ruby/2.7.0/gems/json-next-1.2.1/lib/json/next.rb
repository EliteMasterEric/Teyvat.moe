# encoding: utf-8

require 'json'
require 'strscan'   ## StringScanner
require 'pp'


# our own code
require 'json/next/version'   # note: let version always go first
require 'json/next/pattern'    #  shared utils for "custom" parser
require 'json/next/commata'

require 'json/next/parser/hanson'
require 'json/next/parser/son'
require 'json/next/parser/jsonx'



# say hello
puts JSON::Next.banner    if defined?( $RUBYLIBS_DEBUG )
