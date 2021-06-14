# frozen_string_literal: true

# Defines an error which is thrown when
# the user attempts to use an algorithm which is not defined.
#
# If the algorithm you want isn't implemented,
# please create an issue on GitHub.
# I can add the library that implements it as an optional dependency.
class UnknownAlgorithmError < StandardError
  def initialize(algorithm = "~")
    super("Attempted to hash with unknown algorithm (got #{algorithm})")
  end
end

# Defines an error which is thrown when
# the user attempts to use an algorithm which is not defined.
#
# If the type you want is standard in Ruby, and doesn't have an encoder yet,
# please create an issue on GitHub.
class NoEncoderError < StandardError
  def initialize(type = "~")
    super("Attempted to encode unknown class (got #{type})")
  end
end
