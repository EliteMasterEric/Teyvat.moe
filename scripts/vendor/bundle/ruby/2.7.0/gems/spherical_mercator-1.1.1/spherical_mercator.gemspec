$LOAD_PATH.unshift(File.join(File.dirname(__FILE__), 'lib'))

require 'spherical_mercator/version'

Gem::Specification.new do |gem|
  gem.name = 'spherical_mercator'
  gem.version = SphericalMercator.gem_version
  gem.summary = 'Spherical Mercator math in Ruby'
  gem.description = 'Spherical Mercator provides projection math for converting between mercator' \
                    'meters, screen pixels (of 256x256 or configurable-size tiles), and latitude/longitude'
  gem.authors = ['Nikita Bulai']
  gem.email = 'bulajnikita@gmail.com'
  gem.require_paths = ['lib']
  gem.files = `git ls-files`.split($RS)
  gem.homepage = 'http://github.com/nbulaj/spherical_mercator'
  gem.license = 'MIT'
  gem.required_ruby_version = '>= 2.0'

  gem.add_development_dependency 'rspec', '~> 3.5'
end
