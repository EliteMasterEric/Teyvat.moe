require 'json'
require 'object_hash_rb'

# Modify this.
INPUT_DATA = [
  -18.49523,
  39.56726
]

def truncate_number(input)
  # Truncate to 5 digits.
  format('%<input>.5f', input: input).to_f
end

def main
  input = INPUT_DATA.map { |i| truncate_number(i.to_f) }

  puts(JSON.generate(input))
  puts(ObjectHash.hash(input, algorithm: 'passthrough'))
  puts(ObjectHash.hash(input, algorithm: 'sha1'))
end

main