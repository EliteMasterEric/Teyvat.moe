require 'json'
require 'object_hash_rb'

# Modify this.
INPUT_DATA = [
  -35.32031, 30.11328
]

def truncate_number(input)
  # Truncate to 5 digits.
  format('%<input>.5f', input: input).to_f
end

def main
  # input = INPUT_DATA.map { |i| truncate_number(i.to_f) }

  puts(JSON.generate(INPUT_DATA))
  puts(ObjectHash.hash(INPUT_DATA, algorithm: 'passthrough'))
  puts(ObjectHash.hash(INPUT_DATA, algorithm: 'sha1'))
end

main