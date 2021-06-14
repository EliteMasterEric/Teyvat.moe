# encoding: utf-8

###
#  based on github.com/aleksandergurin/simple-object-notation
#   Thanks to Aleksander Gurin


module SON


  DOUBLE_QUOTE      = JSON::Next::DOUBLE_QUOTE

  SHELL_COMMENT     = JSON::Next::SHELL_COMMENT


  def self.strip_comments( text )   ## pass 1
    text.gsub( /#{DOUBLE_QUOTE}|#{SHELL_COMMENT}/ox ) do |match|
       ## puts "match: >>#{match}<< : #{match.class.name}"
       if match[0] == ?#    ## comments start with #
         ## puts "!!! removing comments"
         ''    ## remove / strip comments
       else
         match
       end
     end
  end




  def self.convert( text )

    # text is the SON string to convert.

    text = strip_comments( text )    ## pass 1
    text = JSON::Next::Commata.convert( text )  ## pass 2 - auto-add (missing optional) commas
    text
  end


  def self.parse( text )
    JSON.parse( self.convert( text ) )
  end

end # module SON
