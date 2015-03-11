require 'sinatra'
require "better_errors"
require 'multi_json'
require 'sass'

require 'acceptd/common_routes'
require 'acceptd/app_routes'

class Acceptd::App < Sinatra::Base

  configure :development do
    MultiJson.use :yajl

    use BetterErrors::Middleware

    BetterErrors.application_root = __dir__
  end

  use Acceptd::AppRoutes

  use Acceptd::CommonRoutes

end
