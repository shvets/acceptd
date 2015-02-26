require 'sinatra'

module Acceptd
  class App < Sinatra::Base
    set :views, "#{File.expand_path(File.dirname(__FILE__))}/../views"
    set :public_dir, "#{File.expand_path(File.dirname(__FILE__))}/../../public"

    get '/stylesheet.css' do
      headers 'Content-Type' => 'text/css; charset=utf-8'
      sass :stylesheet
    end

    get '/' do
      erb :index
    end
  end
end

