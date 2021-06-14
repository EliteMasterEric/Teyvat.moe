# -*- encoding: utf-8 -*-
# stub: object_hash_rb 0.1.3 ruby lib

Gem::Specification.new do |s|
  s.name = "object_hash_rb".freeze
  s.version = "0.1.3"

  s.required_rubygems_version = Gem::Requirement.new(">= 0".freeze) if s.respond_to? :required_rubygems_version=
  s.metadata = { "changelog_uri" => "https://github.com/MasterEric/object_hash_rb/CHANGELOG.md", "homepage_uri" => "https://github.com/MasterEric/object_hash_rb", "source_code_uri" => "https://github.com/MasterEric/object_hash_rb" } if s.respond_to? :metadata=
  s.require_paths = ["lib".freeze]
  s.authors = ["MasterEric".freeze]
  s.bindir = "exe".freeze
  s.date = "2021-01-01"
  s.description = "Generate cryptographic hashes from objects and values in Ruby.Built for compatibility with `object-hash` for JavaScript.".freeze
  s.homepage = "https://github.com/MasterEric/object_hash_rb".freeze
  s.licenses = ["MIT".freeze]
  s.required_ruby_version = Gem::Requirement.new(">= 2.4.0".freeze)
  s.rubygems_version = "3.1.4".freeze
  s.summary = "Generate cryptographic hashes from objects and values.".freeze

  s.installed_by_version = "3.1.4" if s.respond_to? :installed_by_version

  if s.respond_to? :specification_version then
    s.specification_version = 4
  end

  if s.respond_to? :add_runtime_dependency then
    s.add_development_dependency(%q<bundler>.freeze, [">= 0"])
    s.add_development_dependency(%q<coveralls>.freeze, [">= 0"])
    s.add_development_dependency(%q<rake>.freeze, [">= 0"])
    s.add_development_dependency(%q<rspec>.freeze, [">= 0"])
    s.add_development_dependency(%q<rubocop>.freeze, [">= 0"])
  else
    s.add_dependency(%q<bundler>.freeze, [">= 0"])
    s.add_dependency(%q<coveralls>.freeze, [">= 0"])
    s.add_dependency(%q<rake>.freeze, [">= 0"])
    s.add_dependency(%q<rspec>.freeze, [">= 0"])
    s.add_dependency(%q<rubocop>.freeze, [">= 0"])
  end
end
