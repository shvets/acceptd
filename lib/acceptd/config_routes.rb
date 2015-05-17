require "acceptd/routes_base"

require 'yaml'
require 'active_support/core_ext/hash'
require 'script_executor'
require 'rspec'
require 'capybara'
require 'erb'

class Acceptd::ConfigRoutes < Acceptd::RoutesBase
  ACCEPTD_CONFIG_FILE_NAME = ".acceptd.yaml"
  WORKSPACE_DIR = 'workspace'

  get '/config' do
    erb :config
  end

  get '/load_config' do
    workspace_dir = params[:workspace_dir] ? params[:workspace_dir] : File.expand_path(WORKSPACE_DIR)

    load_config(workspace_dir, ACCEPTD_CONFIG_FILE_NAME).to_json
  end

  get '/save_config' do
    save_config(params[:workspace_dir], ACCEPTD_CONFIG_FILE_NAME, params)

    erb :index
  end

  private

  def load_config workspace_dir, file_name
    config = {}

    projects = projects(workspace_dir)

    if File.exist?("#{workspace_dir}/#{file_name}")
      config.merge!(YAML.load_file("#{workspace_dir}/#{file_name}"))
    else
      config['webapp_url'] = "http://localhost:4567"

      config['browser'] = "firefox"
      config['driver'] = "selenium"
      config['timeout_in_seconds'] = "10"

      config['selected_project'] = projects.first
      config['selected_files'] = []
      config['workspace_dir'] = workspace_dir
    end

    config['projects'] = projects
    config['files'] = feature_files(workspace_dir, config['selected_project'])

    config
  end

  def save_config workspace_dir, file_name, config
    File.open("#{workspace_dir}/#{file_name}", 'w') { |file| file.write config.to_yaml }
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
