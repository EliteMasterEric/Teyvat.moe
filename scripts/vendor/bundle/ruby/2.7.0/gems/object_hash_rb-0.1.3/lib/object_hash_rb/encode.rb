# frozen_string_literal: true

# Add helper methods to the Time class.
require "time"

# @INTERNAL: Please use ObjectHash.hash() instead.
# Contains methods to encode any object into a string.
# Performs the functions of the typeHasher in the original JS library.
# Encode is a class rather than a module since it has to maintain a state.
module Encode
  # Used by the Encoder with js_prototypes enabled,
  # to emulate a key with a value of undefined.
  class Undefined; end

  # Performs encoding while managing state.
  class Encoder
    private

    #
    # OPTIONS
    #

    # Provide an optional function which will process values before parsing.
    @replacer = nil
    # If true, object keys will be sorted alphabetically.
    # If false, key order will be respected.
    @unordered_objects = true

    #
    # ENCODING METHODS
    #

    # Each method encodes certain types, and is named after the type it encodes,
    # and is called dynamically based on that, thus the uppercase.
    # rubocop:disable Naming/MethodName

    def encode_Array(input)
      # Encode each element, then concatenate together.
      "array:#{input.length}:#{input.map { |y| encode_value(y) }.reduce(:+)}"
    end

    def encode_Circular(input)
      encode_String("[CIRCULAR:#{@context.index(input)}]")
    end

    def encode_Hash(input)
      # Keeps track of what elements have been processed already.
      # Used to prevent parsing circular references.
      keys = @unordered_objects ? input.keys.sort : input.keys

      # Check each key and format it.
      "object:#{input.length}:#{keys.map do |key|
        value = input[key]
        return encode_Circular(value) if !@context.empty? && @context.index(value)

        @context.push(input[key])
        "#{encode_value(key)}:#{encode_value(value)},"
      end.reduce(:+)}"
    end

    def encode_Number(input)
      "number:#{input}"
    end

    def encode_Integer(input)
      encode_Number(input)
    end

    def encode_Float(input)
      return "number:NaN" if input.nan?

      return input.positive? ? "number:Infinity" : "number:-Infinity" if input.infinite?

      encode_Number(input)
    end

    def encode_String(input)
      "string:#{input.length}:#{input}"
    end

    def encode_Symbol(input)
      "symbol:#{input}"
    end

    def encode_Boolean(input)
      "bool:#{input}"
    end

    def encode_TrueClass(input)
      encode_Boolean(input)
    end

    def encode_FalseClass(input)
      encode_Boolean(input)
    end

    def encode_Time(input)
      "date:#{input.strftime("%Y-%m-%dT%H:%M:%S.%LZ")}"
    end

    def encode_DateTime(input)
      "date:#{input.strftime("%Y-%m-%dT%H:%M:%S.%LZ")}"
    end

    def encode_NilClass(_input)
      "Null"
    end

    def encode_Undefined(_input)
      "Undefined"
    end

    # End encoding methods.
    # rubocop:enable Naming/MethodName

    # @param t: Type of the input value.
    #   Allows recursive calls which switch which type is used.
    def encode_value(input)
      # If the user specified a custom replacer...
      input = @replacer.call(input) unless @replacer.nil?

      begin
        # Call the appropriate method by name, if it exists,
        # and return its result.
        method("encode_#{input.class}").call(input)
      rescue NameError
        raise NoEncoderError, input.class.to_s
      end
    end

    public

    # When initializing, you can provide options to modify how the encoder functions.
    def initialize(replacer: nil, unordered_objects: true)
      # OPTIONS
      @replacer = replacer
      @unordered_objects = unordered_objects

      # Used for circular reference handling.
      @context = []
    end

    def encode_cleanup
      @context = []
    end

    # @INTERNAL: Please use ObjectHash.hash() instead.
    # Encodes the input value to match a standardized format.
    def perform_encode(input)
      # Encode the value.
      result = encode_value(input)

      # Cleanup.
      encode_cleanup

      # Return the encoded value.
      result
    end
  end
end
