require "acceptd/routes_base"

require 'yaml'
require 'active_support/core_ext/hash'
require 'script_executor'
require 'rspec'
require 'capybara'
require 'erb'

class Acceptd::ConfigRoutes < Acceptd::RoutesBase
  ACCEPTD_ROOT_DIR = File.expand_path(".")
  ACCEPTD_CONFIG_FILE_NAME = "#{ACCEPTD_ROOT_DIR}/.acceptd.yaml"
  WORKSPACE_DIR = 'workspace'

  get '/config' do
    erb :config
  end

  get '/load_config' do
    load_config(ACCEPTD_CONFIG_FILE_NAME).to_json
  end

  get '/save_config' do
    save_config(ACCEPTD_CONFIG_FILE_NAME, params)

    erb :index
  end

  get '/projects' do
    projects(params['workspace_dir']).to_json
  end

  get '/feature_files' do
    feature_files(params['workspace_dir'], params['selected_project']).to_json
  end

  private

  def load_config file_name
    config = File.exist?(file_name) ? YAML.load_file(file_name) : {}

    if config.empty?
      config['workspace_dir'] = ACCEPTD_ROOT_DIR + "/" + WORKSPACE_DIR
      config['webapp_url'] = "http://localhost:4567"

      config['timeout_in_seconds'] = "10"
      config['browser'] = "firefox"
      config['driver'] = "selenium"

      config['selected_files'] = []
    end

    projects = projects(config['workspace_dir'])

    config['selected_project'] = projects.first unless config['selected_project']

    config['projects'] = projects
    config['feature_files'] = feature_files(config['workspace_dir'], config['selected_project'])

    config
  end

  def save_config file_name, config
    File.open(file_name, 'w') { |file| file.write config.to_yaml }
  end

  def projects workspace_dir
    projects = []

    files = Dir.glob("#{workspace_dir}/*")

    files.each do |file|
      short_name = file[workspace_dir.size+1..-1]

      if File.directory?(file)
        feature_files = Dir.glob("#{file}/**/*.feature")

        if File.basename(short_name) != 'support' and feature_files.size > 0
          projects << short_name
        end
      end
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
