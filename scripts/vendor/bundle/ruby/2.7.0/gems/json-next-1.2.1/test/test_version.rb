# encoding: utf-8

###
#  to run use
#     ruby -I ./lib -I ./test test/test_version.rb


require 'helper'


class TestVersion < MiniTest::Test


  def test_version

    pp JSON::Next::UNESCAPE_MAP
    pp JSON::Next::ML_ESCAPE_MAP

    pp JSON::Next::BACKTICK_ML_QUOTE
    puts JSON::Next::BACKTICK_ML_QUOTE
    pp JSON::Next::SINGLE_QUOTE
    puts JSON::Next::SINGLE_QUOTE
    pp JSON::Next::DOUBLE_QUOTE
    puts JSON::Next::DOUBLE_QUOTE

    pp JSON::Next::CLANG_ML_COMMENT
    puts JSON::Next::CLANG_ML_COMMENT
    pp JSON::Next::CLANG_COMMENT
    puts JSON::Next::CLANG_COMMENT


    puts JSON::Next::VERSION
    assert true
    ## assume everything ok if get here
  end

end # class TestVersion
