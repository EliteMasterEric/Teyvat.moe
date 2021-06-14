# encoding: utf-8

###
#  to run use
#     ruby -I ./lib -I ./test test/test_commata.rb


require 'helper'


class TestCommata < MiniTest::Test

  def test_commata


    sample1,  exp1  = TestBlockFile.read_utf8( 'commata1' )
    sample2a, exp2a = TestBlockFile.read_utf8( 'commata2a' )
    sample2b, exp2b = TestBlockFile.read_utf8( 'commata2b' )

    json1 = JSON::Next::Commata.convert( sample1, debug: true )
    puts json1

    assert_equal eval(exp1), JSON.parse( json1 )


    json2a = JSON::Next::Commata.convert( sample2a, debug: true )
    puts json2a

    assert_equal eval(exp2a), JSON.parse( json2a )


    json2b = JSON::Next::Commata.convert( sample2b, debug: true )
    puts json2b

    assert_equal eval(exp2b), JSON.parse( json2b )
  end

end
