# encoding: utf-8

###
#  to run use
#     ruby -I ./lib -I ./test test/test_parser_hanson.rb


require 'helper'


class TestParser < MiniTest::Test

  def test_hanson

    sample1, exp1 = TestBlockFile.read_utf8( 'hanson1' )

    puts HANSON.convert( sample1 )

    pp HANSON.parse( sample1 )

    assert_equal eval( exp1 ), HANSON.parse( sample1 )
  end

end
