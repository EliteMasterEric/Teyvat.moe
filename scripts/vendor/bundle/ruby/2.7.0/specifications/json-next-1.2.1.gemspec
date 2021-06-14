# -*- encoding: utf-8 -*-
# stub: json-next 1.2.1 ruby lib

Gem::Specification.new do |s|
  s.name = "json-next".freeze
  s.version = "1.2.1"

  s.required_rubygems_version = Gem::Requirement.new(">= 0".freeze) if s.respond_to? :required_rubygems_version=
  s.require_paths = ["lib".freeze]
  s.authors = ["Gerald Bauer".freeze]
  s.date = "2017-07-10"
  s.description = "json-next - read generation y / next generation json versions (HanSON, SON, JSONX/JSON11, etc.) with comments, unquoted keys, multi-line strings, trailing commas, optional commas, and more".freeze
  s.email = "ruby-talk@ruby-lang.org".freeze
  s.extra_rdoc_files = ["HISTORY.md".freeze, "Manifest.txt".freeze, "README.md".freeze]
  s.files = ["HISTORY.md".freeze, "Manifest.txt".freeze, "README.md".freeze]
  s.homepage = "https://github.com/datatxt/json-next".freeze
  s.licenses = ["Public Domain".freeze]
  s.rdoc_options = ["--main".freeze, "README.md".freeze]
  s.required_ruby_version = Gem::Requirement.new(">= 1.9.2".freeze)
  s.rubygems_version = "3.1.4".freeze
  s.summary = "json-next - read generation y / next generation json versions (HanSON, SON, JSONX/JSON11, etc.) with comments, unquoted keys, multi-line strings, trailing commas, optional commas, and more".freeze

  s.installed_by_version = "3.1.4" if s.respond_to? :installed_by_version

  if s.respond_to? :specification_version then
    s.specification_version = 4
  end

  if s.respond_to? :add_runtime_dependency then
    s.add_development_dependency(%q<rdoc>.freeze, ["~> 4.0"])
    s.add_development_dependency(%q<hoe>.freeze, ["~> 3.16"])
  else
    s.add_dependency(%q<rdoc>.freeze, ["~> 4.0"])
    s.add_dependency(%q<hoe>.freeze, ["~> 3.16"])
  end
end
