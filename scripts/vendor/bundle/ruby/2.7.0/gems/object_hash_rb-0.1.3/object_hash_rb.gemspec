# frozen_string_literal: true

require_relative "lib/object_hash_rb/version"

Gem::Specification.new do |spec|
  spec.name          = "object_hash_rb"
  spec.version       = ObjectHash::VERSION
  spec.authors       = ["MasterEric"]

  spec.summary       = "Generate cryptographic hashes from objects and values."
  spec.description   = "Generate cryptographic hashes from objects and values in Ruby."\
    "Built for compatibility with `object-hash` for JavaScript."
  spec.homepage      = "https://github.com/MasterEric/object_hash_rb"
  spec.license       = "MIT"

  # TODO: Should this be set lower to increase compatibility?
  spec.required_ruby_version = Gem::Requirement.new(">= 2.4.0")

  spec.metadata["homepage_uri"] = "https://github.com/MasterEric/object_hash_rb"
  spec.metadata["source_code_uri"] = "https://github.com/MasterEric/object_hash_rb"
  spec.metadata["changelog_uri"] = "https://github.com/MasterEric/object_hash_rb/CHANGELOG.md"

  # Specify which files should be added to the gem when it is released.
  # The `git ls-files -z` loads the files in the RubyGem that have been added into git.
  spec.files = Dir.chdir(File.expand_path(__dir__)) do
    `git ls-files -z`.split("\x0").reject { |f| f.match(%r{\A(?:test|spec|features)/}) }
  end
  spec.bindir        = "exe"
  spec.executables   = spec.files.grep(%r{\Aexe/}) { |f| File.basename(f) }
  spec.require_paths = ["lib"]

  # Add dependencies from the Gemfile.
  spec.add_development_dependency "bundler"
  spec.add_development_dependency "coveralls"
  spec.add_development_dependency "rake"
  spec.add_development_dependency "rspec"
  spec.add_development_dependency "rubocop"
end
