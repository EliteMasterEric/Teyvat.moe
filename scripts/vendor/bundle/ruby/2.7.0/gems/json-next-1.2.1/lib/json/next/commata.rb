# encoding: utf-8

module JSON
  module Next


### auto-add commas for objects and arrays
class Commata


## convenience helper
def self.convert( str, opts={} )
   self.new.convert( str, opts )
end


def convert( str, opts={} )
   @debug  = opts.fetch( :debug, false )
   @out    = ""
   @buffer = StringScanner.new( str )

   skip_whitespaces
   parse_value
   @out
end


def debug?() @debug; end



def skip_whitespaces
  @buffer.skip( /[ \t\n]*/ )    ## skip trailing WHITESPACE
end


def parse_string

   if @buffer.peek(1) == '"'   ## double quote
       @buffer.getch  # consume double quote
       value = @buffer.scan( /(\\.|[^"])*/ )
       @buffer.getch  # consume double quote

       puts %{string value >>#{value}<<} if debug?
       @out << ' "'
       @out << value
       @out << '" '

       skip_whitespaces
   else
     puts "!! format error: string literal - expected opening quote (\") - rest is >>#{@buffer.rest}<<"
   end
end



def parse_object

 if @buffer.peek(1) == '{'
     @buffer.getch   # consume '{'
     @out << ' { '
     skip_whitespaces

    if @buffer.peek(1) == '}'    ## empty object?
      @buffer.getch   # consume '{'
      @out << ' } '
      skip_whitespaces
      return
    end

    loop do
      parse_string
      if @buffer.peek(1) == ':'
         @buffer.getch   # consume ':'
         @out << ' : '
         skip_whitespaces

         parse_value
         if @buffer.peek(1) == '}'
           @buffer.getch   # consume '}'
           @out << ' } '
           skip_whitespaces
           return   ## use break - why? why not?
         else
           if @buffer.peek(1) == ','
              @buffer.getch   # consume ','
              @out << ' , '
              skip_whitespaces
           else
             puts "object literal - auto-add comma for key-value pair" if debug?
             @out << ' , '
           end
         end
      else
        puts "!! format error: object literal - expected colon (:) - rest is >>#{@buffer.rest}<<"
      end
    end
 else
     puts "!! format error: object literal - expected curly open bracket ({) - rest is >>#{@buffer.rest}<<"
 end
end  # method parse_object



def parse_array

 if @buffer.peek(1) == '['
     @buffer.getch   # consume '['
     @out << ' [ '
     skip_whitespaces

    if @buffer.peek(1) == ']'    ## empty array?
      @buffer.getch   # consume ']'
      @out << ' ] '
      skip_whitespaces
      return
    end

    loop do
         parse_value
         if @buffer.peek(1) == ']'
           @buffer.getch   # consume ']'
           @out << ' ] '
           skip_whitespaces
           return   ## use break - why? why not?
         else
           if @buffer.peek(1) == ','
              @buffer.getch   # consume ','
              @out << ' , '
              skip_whitespaces
           else
             puts "array literal - auto-add comma for value" if debug?
             @out << ' , '
           end
         end
    end
 else
     puts "!! format error: array literal - expected square open bracket ([) - rest is >>#{@buffer.rest}<<"
 end
end  # method parse_array



def parse_value
  if @buffer.peek(1) == '{'
     parse_object
  elsif @buffer.peek(1) == '['
     parse_array
  elsif @buffer.peek(1) == '"'
     parse_string
  else
     ## assume number or literal/identifier
    value = @buffer.scan( /[_$a-zA-Z0-9.+\-]+/ )
    puts %{literal value >>#{value}<<}  if debug?
    @out << " "
    @out << value
    @out << " "

    skip_whitespaces
  end

  ## todo/fix: check if eof reached ?? if not report warning - more data available??
  ##  wrap in object ({}) or array ([])
end


end  # class Commata


  end # module Next
end # module JSON
