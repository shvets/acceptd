require "acceptd/routes_base"

require 'yaml'
require 'active_support/core_ext/hash'
require 'script_executor'
require 'rspec'
require 'capybara'

class Acceptd::ConfigRoutes < Acceptd::RoutesBase
  ACCEPTD_ROOT_DIR = File.expand_path(".")
  ACCEPTD_CONFIG_FILE_NAME = "#{ENV['HOME']}/.acceptd.yaml"

  get '/load_config' do
    load_config(ACCEPTD_CONFIG_FILE_NAME).to_json
  end

  get '/save_config' do
    save_config(ACCEPTD_CONFIG_FILE_NAME, params)
  end

  private

  def load_config file_name
    config = File.exist?(file_name) ? YAML.load_file(file_name) : {}

    if config.empty?
      config['webapp_url'] = "http://localhost:4567"

      config['timeout_in_seconds'] = "10"
      config['browser'] = "chrome"
      config['driver'] = "selenium"

      config['selected_project'] = ACCEPTD_ROOT_DIR
      config['selected_files'] = []

      save_config file_name, config
    end

    config
  end

  private

  def save_config file_name, config
    File.open(file_name, 'w') { |file| file.write config.to_yaml }
  end

end
