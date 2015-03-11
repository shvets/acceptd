require 'sinatra'
require "better_errors"
require 'json'
require 'sass'

require "sinatra/reloader" if development?

# require_relative 'app_helper'

module Acceptd
  class App < Sinatra::Base
    set :views, "#{File.expand_path(File.dirname(__FILE__))}/../views"
    set :public_dir, "#{File.expand_path(File.dirname(__FILE__))}/../../public"

    # before do
    #   content_type :json
    # end

    configure :development do
      use BetterErrors::Middleware

      BetterErrors.application_root = __dir__
    end

    get '/stylesheet.css' do
      headers 'Content-Type' => 'text/css; charset=utf-8'
      sass :stylesheet
    end

    get '/' do
      # raise "oops"

      workspace_dir = File.expand_path("workspace")
      project = "wikipedia"

      webapp_url = "http://localhost:4567"
      browser = "firefox"
      driver = "selenium"
      timeout_in_seconds = "10"

      files = Dir.glob("#{workspace_dir}/#{project}/**/*.feature")

      files.each_with_index do |file, index|
        files[index] = file[workspace_dir.size+1..-1]
      end

      locals = {workspace_dir: workspace_dir, project: project,  webapp_url: webapp_url,
                browser: browser, driver: driver, timeout_in_seconds: timeout_in_seconds,
                files: files}

      erb :index, {}, locals
    end

    get '/run' do
      system "rspec workspace/wikipedia/features/search_with_drivers.feature"

      erb :run
    end

    get '/test' do
      content_type :json
      { message: 'Hello World!' }.to_json
    end

    # http://samurails.com/tutorial/cors-with-angular-js-and-sinatra/

    get '/movie' do
      { result: "Monster University" }.to_json
    end

    post '/movie' do
      { result: params[:movie] }.to_json
    end

    # not_found do
    #   content_type :json
    #   halt 404, { error: 'URL not found' }.to_json
    # end

    helpers do
      def checked(current, value)
        (current == value) ? "checked" : ""
      end
    end
  end
end

