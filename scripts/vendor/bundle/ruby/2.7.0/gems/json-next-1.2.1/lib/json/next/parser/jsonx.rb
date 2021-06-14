# encoding: utf-8


##
##   JSON with Extensions (JSONX)  or
##   JSON 1.1 - JSON XI



module JSONX


    BACKTICK_ML_QUOTE = JSON::Next::BACKTICK_ML_QUOTE
    SINGLE_QUOTE      = JSON::Next::SINGLE_QUOTE
    DOUBLE_QUOTE      = JSON::Next::DOUBLE_QUOTE

    CLANG_ML_COMMENT  = JSON::Next::CLANG_ML_COMMENT
    CLANG_COMMENT     = JSON::Next::CLANG_COMMENT
    SHELL_COMMENT     = JSON::Next::SHELL_COMMENT

    KEYWORDS          = JSON::Next::KEYWORDS
    IDENTIFIER        = JSON::Next::IDENTIFIER_EXTENDED
    TRAILING_COMMA    = JSON::Next::TRAILING_COMMA

    UNESCAPE_MAP      = JSON::Next::UNESCAPE_MAP
    ML_ESCAPE_MAP     = JSON::Next::ML_ESCAPE_MAP



    def self.strip_comments( text )   ## pass 1
      text.gsub( /#{BACKTICK_ML_QUOTE}|#{SINGLE_QUOTE}|#{DOUBLE_QUOTE}|#{SHELL_COMMENT}|#{CLANG_ML_COMMENT}|#{CLANG_COMMENT}/ox ) do |match|
         ## puts "match: >>#{match}<< : #{match.class.name}"
         if match[0] == ?/ ||  match[0] == ?#    ## comments start with // or /* or  #
           ## puts "!!! removing comments"
           ''    ## remove / strip comments
         else
           match
         end
       end
    end


    ### note: same as hanson (see parser/hanson.rb)
    def self.normalize_quotes( text )  ## pass 2
       text.gsub( /#{BACKTICK_ML_QUOTE}|#{SINGLE_QUOTE}|#{DOUBLE_QUOTE}/ox ) do |match|
         ## puts "match: >>#{match}<< : #{match.class.name}"

         m = Regexp.last_match
         if m[:backtick_ml_quote]
           ## puts "!!! ml_quote -- convert to double quotes"
           str = m[:backtick_ml_quote]
           str = str.gsub( /\\./ ) {|r| UNESCAPE_MAP[r] || r }
           str = str.gsub( /[\n\r\t"]/ ) { |r| ML_ESCAPE_MAP[r] }
           '"' + str + '"'
         elsif m[:single_quote]
           ## puts "!!! single_quote -- convert to double quotes"
           str = m[:single_quote]
           str = str.gsub( /\\./ ) {|r| UNESCAPE_MAP[r] || r }
           str = str.gsub( /"/, %{\\"} )
           '"' + str + '"'
         else
           match
         end
      end
    end


  def self.convert( text )

    ## pass 1: remove/strip comments
    text = strip_comments( text )

    ## pass 2: requote/normalize quotes
    text = normalize_quotes( text )

    ## pass 3: quote unquoted and remove trailing commas
    text = text.gsub( /#{KEYWORDS}|#{IDENTIFIER}|#{DOUBLE_QUOTE}|#{TRAILING_COMMA}/ox ) do |match|
       ## puts "match: >>#{match}<< : #{match.class.name}"

       m = Regexp.last_match
       if m[:identifier]
         ## puts "!!! identfier -- wrap in double quotes"
         '"' + m[:identifier] + '"'
       elsif m[:trailing_comma]
         ## puts "!!! trailing comma -- remove"
         ''
       else
         match
       end
    end

    ## pass 4 - auto-add (missing optional) commas
    text = JSON::Next::Commata.convert( text )
    text
  end


  def self.parse( text )
    JSON.parse( self.convert( text ) )
  end

end # module JSONX

## add some aliases

JSONXI = JSONX
JSONII = JSONX
JSON11 = JSONX
