require 'sinatra'
require 'sass'

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
      browser ="firefox"

      files = Dir.glob("#{workspace_dir}/#{project}/**/*.feature")

      files.each_with_index do |file, index|
        files[index] = file[workspace_dir.size+1..-1]
      end

      locals = {workspace_dir: workspace_dir,project: project, browser: browser, files: files}

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

