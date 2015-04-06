require "acceptd/routes_base"

require 'yaml'
require 'active_support/core_ext/hash'

class Acceptd::AppRoutes < Acceptd::RoutesBase
  ACCEPTD_CONFIG_FILE_NAME = ".acceptd.yaml"

  set :views, "#{File.expand_path(File.dirname(__FILE__))}/../views"
  set :public_dir, "#{File.expand_path(File.dirname(__FILE__))}/../../public"

  get '/stylesheet.css' do
    headers 'Content-Type' => 'text/css; charset=utf-8'
    sass :stylesheet
  end

  get '/' do
    erb :index
  end

  get '/load_config' do
    load_config(ACCEPTD_CONFIG_FILE_NAME).to_json
  end

  get '/save_config' do
    save_config params, ACCEPTD_CONFIG_FILE_NAME

    erb :index
  end

  get '/run' do
    p params

    sleep 4

    p "rspec workspace/wikipedia/features/search_with_drivers.feature"

    erb :run
  end

  helpers do
    def checked(current, value)
      (current == value) ? "checked" : ""
    end
  end

  private

  def load_config file_name
    config = {}

    workspace_dir = "workspace"

    projects = projects(workspace_dir)

    if File.exist?(file_name)
      config.merge!(YAML.load_file(file_name))
    else
      config['webapp_url'] = "http://localhost:4567"

      config['browser'] = "firefox"
      config['driver'] = "selenium"
      config['timeout_in_seconds'] = "10"

      config['selected_project'] = projects.first
      config['selected_files'] = []
    end

    config['workspace_dir'] = workspace_dir
    config['projects'] = projects
    config['files'] = feature_files(workspace_dir, config['selected_project'])

    config
  end

  def save_config config, file_name
    File.open(file_name, 'w') {|file| file.write config.to_yaml }
  end

  def projects workspace_dir
    projects = []

    files = Dir.glob("#{workspace_dir}/*")

    files.each do |file|
      basename = File.basename(file)

      projects << basename if basename != 'support'
    end

    projects
  end

  def feature_files workspace_dir, project
    files = Dir.glob("#{workspace_dir}/#{project}/**/*.feature")

    files.each_with_index do |file, index|
      files[index] = file[workspace_dir.size+1..-1]
    end

    files
  end
end
