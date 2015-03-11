require "bundler/setup"

unless defined? Acceptd
  $LOAD_PATH << File.join(__dir__, 'lib')

  require 'acceptd'
end

trap(:INT) { exit }

app = Rack::Builder.new {
  use Rack::CommonLogger

  run Acceptd::App
}.to_app

run app

#`open http://localhost:9292`
