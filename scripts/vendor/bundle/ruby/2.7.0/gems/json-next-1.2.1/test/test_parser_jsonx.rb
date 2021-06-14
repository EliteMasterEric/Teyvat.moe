# encoding: utf-8

###
#  to run use
#     ruby -I ./lib -I ./test test/test_parser_jsonx.rb


require 'helper'


class TestParserJsonx < MiniTest::Test

  def test_jsonx

    sample1, exp1 = TestBlockFile.read_utf8( 'jsonx1' )

    puts JSONX.convert( sample1 )

    assert_equal eval(exp1), JSONX.parse( sample1 )


    sample2, exp2 = TestBlockFile.read_utf8( 'jsonx2' )

    puts JSONX.convert( sample2 )

    assert_equal eval(exp2), JSONX.parse( sample2 )
  end

end
