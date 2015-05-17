require "sinatra/reloader" if development?

class Acceptd::RoutesBase < Sinatra::Base
  register Sinatra::Reloader if development?

  use Rack::Deflater

  enable :sessions

  before do
    # http://thibaultdenizet.com/tutorial/cors-with-angular-js-and-sinatra/

    headers 'Access-Control-Allow-Methods' => ['OPTIONS', 'GET', 'POST'],
            'Access-Control-Allow-Origin' => '*'

    #headers 'Access-Control-Allow-Headers' => 'Authorization,Accepts,Content-Type,X-CSRF-Token,X-Requested-With'
  end

  before %r{.+\.json$} do
    content_type 'application/json'
  end

  # before %r{.+\.xml} do
  #   content_type 'application/xml'
  # end

  set :views, "#{File.expand_path(File.dirname(__FILE__))}/../views"

  set :public_dir, "#{File.expand_path(File.dirname(__FILE__))}/../../public"
end
