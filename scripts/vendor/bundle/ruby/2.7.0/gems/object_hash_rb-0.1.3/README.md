# object_hash_rb

Generate cryptographic hashes from objects and values in Ruby. Supports SHA1 and many others.

The library aims to support hashing of objects such as circular object structures, allowing for simplified deep equality checks.

Built to generate cryptographic hashes which are compatible with [object-hash](https://github.com/puleos/object-hash) for NodeJS.

[![Travis CI](https://img.shields.io/travis/com/mastereric/object_hash_rb/master)](https://travis-ci.com/github/MasterEric/object_hash_rb)
[![RubyGems](https://)](https://img.shields.io/gem/dv/object_hash_rb/stable)
[![Coverage Status](https://img.shields.io/coveralls/github/MasterEric/object_hash_rb/master)](https://coveralls.io/github/MasterEric/object_hash_rb)

## Installation

Add this line to your application's Gemfile:

```ruby
gem 'object_hash_rb'
```

And then execute:

    $ bundle install

Or install it yourself as:

    $ gem install object_hash_rb

## Usage

WARNING: For `object_hash_rb` values to be compatible with NodeJS `object-hash` values, you must disable the `respectTypes` option when hashing in JavaScript.

```ruby
require "object_hash_rb"

# Encode and hash the given input.
ObjectHash.hash("Hello World")
=> "3415EF7FD82C1A04DEA35838ED84A6CECB03C790"

# The input can be any object.
ObjectHash.hash({ a: 1, b: 2, c: 3 })
=> "86BFBAADC95B656DCA2BF2393EF310A1983D59CB"

# The same input has the same output, regardless of key order.
# Great for deep equality checks.
ObjectHash.hash({ c: 3, a: 1, b: 2 })
=> "86BFBAADC95B656DCA2BF2393EF310A1983D59CB"

# There's even a handler for circular references.
test = {a: "b"}
test[:b] = test
ObjectHash.hash(test)
=> "B28AFE82FB41FE5E3CAF60E2045E46E5F5431C04"

# You can use one of several different hashing algorithms...
ObjectHash.hash("foobar", algorithm: "md5")
=> "EB920AE43AF94B25AE057837D80129EC"

# ...or you can select "passthrough" to preview how the library builds hashes.
ObjectHash.hash(test, algorithm: "passthrough")
=> "object:2:symbol:a:string:1:b,symbol:b:string:12:[CIRCULAR:0],"

# If there's a non-standard type you want to hash, you can specify a replacer
# to substitute the value before it gets hashed.
class TestStuff
  def generate_name
    "foobar"
  end
end
ObjectHash.hash({ a: TestStuff.new }, algorithm: "passthrough",
  replacer: lambda do |x|
    # Replace our type.
    return x.generate_name if x.instance_of? TestStuff
    # Else return the original.
    x
  end)
=> "object:1:symbol:a:string:6:foobar,"

# You can also make key order matter.
ObjectHash.hash({ c: 3, a: 1, b: 2 })
=> "86BFBAADC95B656DCA2BF2393EF310A1983D59CB"
ObjectHash.hash({ c: 3, a: 1, b: 2 }, unordered_objects: false)
=> "A3566EE29CFE62438C36C72BDA4C21621445E7D0"

```

## Comparisons

How does this compare with other libraries?

- JS: [puleos/object-hash](https://github.com/puleos/object-hash): `object_hash_rb` is intended to be a compatible port of puelos/object-hash, which has wide adoption. As long as `respectType` is set to false, the JavaScript version will produce identical hashes to this library.
- Ruby: [benlaurie/objecthash](https://github.com/benlaurie/objecthash/tree/master/ruby): `object_hash_rb` competes with, and has the following improvements over, `benlaurie/objecthash`:
  - Direct compatibility with the JavaScript library.
  - Recent maintenance (at time of writing, `benlaurie/objecthash` has not received any fixes in 3 years, for any of its libraries).
  - Higher performance (`benlaurie/objecthash` cryptographically hashes each value individually, whereas `object_hash_rb` produces a single encoding of the object before hashing.)
  - Support for circular references (`benlaurie/objecthash` has no handler to prevent issues with circular references)

## Development

After checking out the repo, run `bin/setup` to install dependencies. Then, run `rake spec` to run the tests. You can also run `bin/console` for an interactive prompt that will allow you to experiment.

To install this gem onto your local machine, run `bundle exec rake install`. To release a new version, update the version number in `version.rb`, and then run `bundle exec rake release`, which will create a git tag for the version, push git commits and the created tag, and push the `.gem` file to [rubygems.org](https://rubygems.org).

## Contributing

Bug reports and pull requests are welcome on GitHub at https://github.com/MasterEric/object_hash_rb. This project is intended to be a safe, welcoming space for collaboration, and contributors are expected to adhere to the [code of conduct](https://github.com/MasterEric/object_hash_rb/blob/master/CODE_OF_CONDUCT.md).

## License

The gem is available as open source under the terms of the [MIT License](https://opensource.org/licenses/MIT).

## Code of Conduct

Everyone interacting in the ObjectHash project's codebases, issue trackers, chat rooms and mailing lists is expected to follow the [code of conduct](https://github.com/MasterEric/object_hash_rb/blob/master/CODE_OF_CONDUCT.md).
