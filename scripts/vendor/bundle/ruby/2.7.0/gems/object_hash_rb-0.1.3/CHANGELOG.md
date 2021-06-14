# CHANGELOG

## 0.1.0

Initial revision.

## 0.1.1

- Added support for circular references.
- Built a full test suite, which now passes!

## 0.1.2

- Improved code coverage.
- Added tests for sha384 and sha512.
- Removed less useful crc32 and adler algorithms.

# 0.1.3

- Renamed to `object_hash_rb` due to conflict with `objecthash`.
  - Although they have similar functionality, `object_hash_rb` includes performance improvements and support for circular references.
- Improved handling of special float values (infinite and nan)