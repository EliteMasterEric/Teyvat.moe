# encoding: utf-8

## minitest setup
require 'minitest/autorun'


$RUBYLIBS_DEBUG = true

## our own code
require 'json/next'




class TestBlockFile
  def self.read_utf8( path )
    BlockFile.read_utf8( "#{JSON::Next.root}/test/data/#{path}.txt" )
  end
end


class BlockFile
  def self.read_utf8( path )
    text = File.open( path, 'r:bom|utf-8' ).read
    reader = BlockReader.new( text )
    reader.blocks
  end
end


class BlockReader

 attr_reader :blocks

 def initialize( text )
   ## split blocks by ---
   @blocks = text.split( /^\s*---\s*$/ )
 end

end ## block reader
