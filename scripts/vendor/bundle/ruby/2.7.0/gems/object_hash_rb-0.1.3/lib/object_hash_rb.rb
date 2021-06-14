# frozen_string_literal: true

require_relative "object_hash_rb/version"

require_relative "object_hash_rb/encode"
require_relative "object_hash_rb/cryptohash"

# Contains functions which encode the input into a standardized format,
# then cryptographically hash it.
module ObjectHash
  # rubocop:disable Lint/SelfAssignment
  Encode = Encode
  CryptoHash = CryptoHash
  # rubocop:enable Lint/SelfAssignment

  module_function

  # Encode the input into a standardized format,
  # then cryptographically hash it.
  # @param input: Any object that should be encoded.
  # @param algorithm: Either a string naming the algorithm to use, or a Digest object that can hash the string.
  #   To preview the output of encoding, use "passthrough".
  # @param replacer: An optional function called on objects before they are encoded.
  #   Use this to replace unencodable objects with Strings or Hashes.
  # @param unordered_objects: If true, objects will have sorted keys.
  #   If false, objects with different order in their keys will have different hashes.
  def hash(input, algorithm: "sha1", replacer: nil, unordered_objects: true)
    CryptoHash.perform_cryptohash(
      Encode::Encoder.new(
        replacer: replacer,
        unordered_objects: unordered_objects
      ).perform_encode(input),
      algorithm
    )
  end
end
