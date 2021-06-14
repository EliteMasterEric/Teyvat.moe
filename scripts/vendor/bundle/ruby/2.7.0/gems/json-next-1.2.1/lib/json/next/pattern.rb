# encoding: utf-8

module JSON
  module Next

  ## note: regex pattern \\ needs to get escaped twice, thus, \\.
  ##  and for literal \\ use \\\\\.

  ## todo: check for newlines   [^] incl. newline ?

  ## note: add named captures for "inner" unquotes string values

  ###############
  ##### quotes


  BACKTICK_ML_QUOTE  = %< ` (?<backtick_ml_quote>
                                (?:
                                  \\\\. | [^`]
                                )*
                            )
                          `
                        >

  ## => \\\\.    --  allow backslash escapes e.g. \n \t \\ etc.
  ## => [^`]     --  everything except backquote

  ## todo/fix - check if [^`] includes/matches newline too (yes)? -- add \n for multi-line!


  SINGLE_QUOTE       = %< ' (?<single_quote>
                              (?:
                                 \\\\. | [^']
                              )*
                            )
                         '
                        >

  DOUBLE_QUOTE       = %< " (?<double_quote>
                              (?:
                                \\\\. | [^"]
                              )*
                            )
                          "
                        >


  #######################
  #### comments

  CLANG_ML_COMMENT     = %< /\\*
                              .*?
                             \\*/
                          >

  ## use . instead of [^] - why? why not?
  ## note: check if . incl. newlines too (only in multi-line (m) option - why? why not??
  ##   fix/todo: include newline!!! \n - for multi-line!!!

  ##  note: *? is NON-greedy


  CLANG_COMMENT        = %<  //
                             .*?
                             (?:
                               \\n | $
                             )
                         >

  ## note: check if . incl. newlines too (only in multi-line (m) option - why? why not??
  ##  note: *? is NON-greedy


  SHELL_COMMENT        = %<  [#]
                             .*?
                             (?:
                               \\n | $
                             )
                         >

## note: use [#] instead of # to avoid confusion with # comment in regex




  KEYWORDS       = %<
                      (?:
                         true | false | null
                      )
                      (?=
                          [^\\w_$] | $
                      )
                    >


  IDENTIFIER     = %<
                      (?<identifier>
                         [a-zA-Z_$]
                         [\\w_$]*
                      )
                    >


  ## note: allow extra chars for identifier (extended)
  ##   e.g. allow dash (-) e.g:
  ##     babel-preset-es2015
  ##     core-js
  ##     cross-spawn
  ##     eslint-config-jquery
  ##   and others

  IDENTIFIER_EXTENDED  = %<
                      (?<identifier>
                         [a-zA-Z_$]
                         [\\w_$\\-]*
                      )
                    >



  TRAILING_COMMA = %<
                      (?<trailing_comma>,)
                      (?=
                        \\s*
                        [}\\]]
                      )
                    >



  UNESCAPE_MAP = {
    %<\\"> => %<">,     ## "\\\"" => "\"",
    %<\\`> => %<`>,     ## "\\`"  => "`",
    %<\\'> => %<'>      ## "\\'"  => "'"
  }

  ML_ESCAPE_MAP = {
    %<\n> => %<\\n>,    ## "\n" => "\\n",
    %<\r> => %<\\r>,    ## "\r" => "\\r",
    %<\t> => %<\\t>,    ## "\t" => "\\t",
    %<">  => %<\\">     ## "\"" => "\\\""
  }


  end # module Next
end # module JSON
