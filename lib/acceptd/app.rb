require 'sinatra'
require 'sass'

require "sinatra/reloader" if development?

# require_relative 'app_helper'

module Acceptd
  class App < Sinatra::Base
    set :views, "#{File.expand_path(File.dirname(__FILE__))}/../views"
    set :public_dir, "#{File.expand_path(File.dirname(__FILE__))}/../../public"

    get '/stylesheet.css' do
      headers 'Content-Type' => 'text/css; charset=utf-8'
      sass :stylesheet
    end

    get '/' do
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

    helpers do
      def checked(current, value)
        (current == value) ? "checked" : ""
      end
    end
  end
end

