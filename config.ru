require "bundler/setup"

$LOAD_PATH.unshift(File.expand_path(File.join(File.dirname(__FILE__), "lib")))

require 'acceptd'

trap(:INT) { exit }

app = Rack::Builder.new {
  use Rack::CommonLogger
  run Acceptd::App
}.to_app

run app
