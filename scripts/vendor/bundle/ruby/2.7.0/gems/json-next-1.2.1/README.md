# json-next

json-next gem -  read generation y / next generation json versions (HanSON, SON, JSONX/JSON11,  etc.) with comments, unquoted keys, multi-line strings, trailing commas, optional commas, and more


* home  :: [github.com/datatxt/json-next](https://github.com/datatxt/json-next)
* bugs  :: [github.com/datatxt/json-next/issues](https://github.com/datatxt/json-next/issues)
* gem   :: [rubygems.org/gems/json-next](https://rubygems.org/gems/json-next)
* rdoc  :: [rubydoc.info/gems/json-next](http://rubydoc.info/gems/json-next)




## Usage - `HANSON.parse`,  `SON.parse`, `JSONX.parse`  

[HanSON](#hanson) •
[SON](#son) •
[JSONX](#jsonx)


### HanSON

_HanSON - JSON for Humans by Tim Jansen et al_

HanSON is an extension of JSON  with a few simple additions to the spec:

- quotes for strings are optional if they follow JavaScript identifier rules.
- you can alternatively use backticks, as in ES6's template string literal, as quotes for strings.
  A backtick-quoted string may span several lines and you are not required to escape regular quote characters,
  only backticks. Backslashes still need to be escaped, and all other backslash-escape sequences work like in
  regular JSON.
- for single-line strings, single quotes (`''`) are supported in addition to double quotes (`""`)
- you can use JavaScript comments, both single line (`//`) and multi-line comments (`/* */`), in all places where JSON allows whitespace.
- Commas after the last list element or object property will be ignored.


Example:

``` js
{
  listName: "Sesame Street Monsters", // note that listName needs no quotes
  content: [
    {
      name: "Cookie Monster",
      /* Note the template quotes and unescaped regular quotes in the next string */
      background: `Cookie Monster used to be a
monster that ate everything, especially cookies.
These days he is forced to eat "healthy" food.`
    }, {
      // You can single-quote strings too:
      name: 'Herry Monster',
      background: `Herry Monster is a furry blue monster with a purple nose.
He's mostly retired today.`
    },    // don't worry, the trailing comma will be ignored
   ]
}
```

Use `HANSON.convert` to convert HanSON text to ye old' JSON text:

``` json
{
  "listName": "Sesame Street Monsters",       
  "content": [
    { "name": "Cookie Monster",
       "background": "Cookie Monster used to be a\n ... to eat \"healthy\" food."
    },
    { "name": "Herry Monster",
      "background": "Herry Monster is a furry blue monster with a purple nose.\n ... today."
    }
  ]
}
```

Use `HANSON.parse` instead of `JSON.parse` to parse text to ruby hash / array / etc.:

``` ruby
{
  "listName" => "Sesame Street Monsters",
  "content" => [
     { "name" => "Cookie Monster",
       "background" => "Cookie Monster used to be a\n ... to eat \"healthy\" food."
     },
     { "name" => "Herry Monster",
       "background" => "Herry Monster is a furry blue monster with a purple nose.\n ... today."
    }
  ]
}
```



### SON

_SON - Simple Object Notation by Aleksander Gurin et al_

Simple data format similar to JSON, but with some minor changes:

- comments starts with `#` sign and ends with newline (`\n`)
- comma after an object key-value pair is optional
- comma after an array item is optional

JSON is compatible with SON in a sense that
JSON data is also SON data, but not vise versa.

Example:

```
{
  # Personal information

  "name": "Alexander Grothendieck"
  "fields": "mathematics"
  "main_topics": [
    "Etale cohomology"
    "Motives"
    "Topos theory"
    "Schemes"
  ]
  "numbers": [1 2 3 4]
  "mixed": [1.1 -2 true false null]
}
```

Use `SON.convert` to convert SON text to ye old' JSON text:

``` json
{
  "name": "Alexander Grothendieck",
  "fields": "mathematics",
  "main_topics": [
    "Etale cohomology",
    "Motives",
    "Topos theory",
    "Schemes"
  ],
  "numbers": [1, 2, 3, 4],
  "mixed": [1.1, -2, true, false, null]
}
```

Use `SON.parse` instead of `JSON.parse` to parse text to ruby hash / array / etc.:

``` ruby

{
  "name" => "Alexander Grothendieck",
  "fields" => "mathematics",
  "main_topics" =>
    ["Etale cohomology", "Motives", "Topos theory", "Schemes"],
  "numbers" => [1, 2, 3, 4],
  "mixed" => [1.1, -2, true, false, nil]    
}
```


### JSONX

_JSON with Extensions or JSON v1.1 (a.k.a. JSON11 or JSON XI or JSON II)_

Includes all JSON extensions from HanSON:

- quotes for strings are optional if they follow JavaScript identifier rules.
- you can alternatively use backticks, as in ES6's template string literal, as quotes for strings.
  A backtick-quoted string may span several lines and you are not required to escape regular quote characters,
  only backticks. Backslashes still need to be escaped, and all other backslash-escape sequences work like in
  regular JSON.
- for single-line strings, single quotes (`''`) are supported in addition to double quotes (`""`)
- you can use JavaScript comments, both single line (`//`) and multi-line comments (`/* */`), in all places where JSON allows whitespace.
- Commas after the last list element or object property will be ignored.


Plus all JSON extensions from SON:

- comments starts with `#` sign and ends with newline (`\n`)
- comma after an object key-value pair is optional
- comma after an array item is optional


Plus some more extra JSON extensions:

- unquoted strings following the JavaScript identifier rules can use the dash (`-`) too e.g. allows common keys such as `core-js`, `babel-preset-es2015`, `eslint-config-jquery` and others



Example:

```
{
  #  use shell-like (or ruby-like) comments

  listName: "Sesame Street Monsters"   # note: comments after key-value pairs are optional  
  content: [
    {
      name: "Cookie Monster"
      // note: the template quotes and unescaped regular quotes in the next string
      background: `Cookie Monster used to be a
monster that ate everything, especially cookies.
These days he is forced to eat "healthy" food.`
    }, {
      // You can single-quote strings too:
      name: 'Herry Monster',
      background: `Herry Monster is a furry blue monster with a purple nose.
He's mostly retired today.`
    },    /* don't worry, the trailing comma will be ignored  */
   ]
}
```


Use `JSONX.convert` (or `JSONXI.convert` or `JSON11.convert` or `JSONII.convert`) to convert JSONX text to ye old' JSON text:


``` json
{
  "listName": "Sesame Street Monsters",       
  "content": [
    { "name": "Cookie Monster",
       "background": "Cookie Monster used to be a\n ... to eat \"healthy\" food."
    },
    { "name": "Herry Monster",
      "background": "Herry Monster is a furry blue monster with a purple nose.\n ... today."
    }
  ]
}
```

Use `JSONX.parse` (or `JSONXI.parse` or `JSON11.parse` or `JSONII.parse`) instead of `JSON.parse` to parse text to ruby hash / array / etc.:

``` ruby
{
  "listName" => "Sesame Street Monsters",
  "content" => [
     { "name" => "Cookie Monster",
       "background" => "Cookie Monster used to be a\n ... to eat \"healthy\" food."
     },
     { "name" => "Herry Monster",
       "background" => "Herry Monster is a furry blue monster with a purple nose.\n ... today."
    }
  ]
}
```



### Live Examples


``` ruby
require 'json/next'

text1 =<<TXT
{
  listName: "Sesame Street Monsters", // note that listName needs no quotes
  content: [
    {
      name: "Cookie Monster",
      /* Note the template quotes and unescaped regular quotes in the next string */
      background: `Cookie Monster used to be a
monster that ate everything, especially cookies.
These days he is forced to eat "healthy" food.`
    }, {
      // You can single-quote strings too:
      name: 'Herry Monster',
      background: `Herry Monster is a furry blue monster with a purple nose.
He's mostly retired today.`
    },    // don't worry, the trailing comma will be ignored
   ]
}
TXT

pp HANSON.parse( text1 )  # note: is the same as JSON.parse( HANSON.convert( text ))
```

resulting in:

``` ruby
{
  "listName" => "Sesame Street Monsters",
  "content" => [
     { "name" => "Cookie Monster",
       "background" => "Cookie Monster used to be a\n ... to eat \"healthy\" food."
     },
     { "name" => "Herry Monster",
       "background" => "Herry Monster is a furry blue monster with a purple nose.\n ... today."
    }
  ]
}
```

and

``` ruby

text2 =<<TXT
{
  # Personal information

  "name": "Alexander Grothendieck"
  "fields": "mathematics"
  "main_topics": [
    "Etale cohomology"
    "Motives"
    "Topos theory"
    "Schemes"
  ]
  "numbers": [1 2 3 4]
  "mixed": [1.1 -2 true false null]
}
TXT

pp SON.parse( text2 )  # note: is the same as JSON.parse( SON.convert( text ))
```

resulting in:

``` ruby
{
  "name" => "Alexander Grothendieck",
  "fields" => "mathematics",
  "main_topics" =>
    ["Etale cohomology", "Motives", "Topos theory", "Schemes"],
  "numbers" => [1, 2, 3, 4],
  "mixed" => [1.1, -2, true, false, nil]    
}
```

and

``` ruby
text3 =<<TXT
{
  #  use shell-like (or ruby-like) comments

  listName: "Sesame Street Monsters"   # note: comments after key-value pairs are optional  
  content: [
    {
      name: "Cookie Monster"
      // note: the template quotes and unescaped regular quotes in the next string
      background: `Cookie Monster used to be a
monster that ate everything, especially cookies.
These days he is forced to eat "healthy" food.`
    }, {
      // You can single-quote strings too:
      name: 'Herry Monster',
      background: `Herry Monster is a furry blue monster with a purple nose.
He's mostly retired today.`
    },    /* don't worry, the trailing comma will be ignored  */
   ]
}
TXT

pp JSONX.parse( text3 )   # note: is the same as JSON.parse( JSONX.convert( text ))
pp JSONXI.parse( text3 )  # note: is the same as JSON.parse( JSONXI.convert( text ))
pp JSON11.parse( text3 )  # note: is the same as JSON.parse( JSON11.convert( text ))
pp JSONII.parse( text3 )  # note: is the same as JSON.parse( JSONII.convert( text ))
```

resulting in:

``` ruby
{
  "listName" => "Sesame Street Monsters",
  "content" => [
     { "name" => "Cookie Monster",
       "background" => "Cookie Monster used to be a\n ... to eat \"healthy\" food."
     },
     { "name" => "Herry Monster",
       "background" => "Herry Monster is a furry blue monster with a purple nose.\n ... today."
    }
  ]
}
```



## More JSON Formats

See the [Awesome JSON (What's Next?)](https://github.com/datatxt/awesome-json-next) collection / page.



## License

![](https://publicdomainworks.github.io/buttons/zero88x31.png)

The `json-next` scripts are dedicated to the public domain.
Use it as you please with no restrictions whatsoever.

## Questions? Comments?

Post them to the [wwwmake forum](http://groups.google.com/group/wwwmake). Thanks!
