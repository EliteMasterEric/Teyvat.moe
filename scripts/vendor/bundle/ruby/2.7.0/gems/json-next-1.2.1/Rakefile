require 'hoe'
require './lib/json/next/version.rb'

Hoe.spec 'json-next' do

  self.version = JSON::Next::VERSION

  self.summary = 'json-next - read generation y / next generation json versions (HanSON, SON, JSONX/JSON11, etc.) with comments, unquoted keys, multi-line strings, trailing commas, optional commas, and more'
  self.description = summary

  self.urls    = ['https://github.com/datatxt/json-next']

  self.author  = 'Gerald Bauer'
  self.email   = 'ruby-talk@ruby-lang.org'

  # switch extension to .markdown for gihub formatting
  self.readme_file  = 'README.md'
  self.history_file = 'HISTORY.md'

  self.licenses = ['Public Domain']

  self.spec_extras = {
   required_ruby_version: '>= 1.9.2'
  }

end
