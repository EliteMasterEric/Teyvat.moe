# -*- encoding: utf-8 -*-
# stub: spherical_mercator 1.1.1 ruby lib

Gem::Specification.new do |s|
  s.name = "spherical_mercator".freeze
  s.version = "1.1.1"

  s.required_rubygems_version = Gem::Requirement.new(">= 0".freeze) if s.respond_to? :required_rubygems_version=
  s.require_paths = ["lib".freeze]
  s.authors = ["Nikita Bulai".freeze]
  s.date = "2021-01-20"
  s.description = "Spherical Mercator provides projection math for converting between mercatormeters, screen pixels (of 256x256 or configurable-size tiles), and latitude/longitude".freeze
  s.email = "bulajnikita@gmail.com".freeze
  s.homepage = "http://github.com/nbulaj/spherical_mercator".freeze
  s.licenses = ["MIT".freeze]
  s.required_ruby_version = Gem::Requirement.new(">= 2.0".freeze)
  s.rubygems_version = "3.1.4".freeze
  s.summary = "Spherical Mercator math in Ruby".freeze

  s.installed_by_version = "3.1.4" if s.respond_to? :installed_by_version

  if s.respond_to? :specification_version then
    s.specification_version = 4
  end

  if s.respond_to? :add_runtime_dependency then
    s.add_development_dependency(%q<rspec>.freeze, ["~> 3.5"])
  else
    s.add_dependency(%q<rspec>.freeze, ["~> 3.5"])
  end
end
