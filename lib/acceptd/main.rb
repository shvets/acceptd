require 'sinatra'
require "sinatra/streaming"
require "better_errors"
require 'multi_json'
require 'sass'

require 'acceptd/common_routes'
require 'acceptd/app_routes'
require 'acceptd/config_routes'
require 'acceptd/file_browser_routes'

class Acceptd::Main < Sinatra::Base
  helpers Sinatra::Streaming

  configure :development do
    MultiJson.use :yajl

    use BetterErrors::Middleware

    BetterErrors.application_root = __dir__
  end

  use Acceptd::AppRoutes
  use Acceptd::ConfigRoutes
  use Acceptd::FileBrowserRoutes

  use Acceptd::CommonRoutes

end
