# encoding: utf-8

###
#  to run use
#     ruby -I ./lib -I ./test test/test_parser_son.rb


require 'helper'


class TestParserSon < MiniTest::Test

  def test_son

    sample1, exp1 = TestBlockFile.read_utf8( 'son1' )

    puts SON.convert( sample1 )

    assert_equal eval(exp1), SON.parse( sample1 )
  end

end
