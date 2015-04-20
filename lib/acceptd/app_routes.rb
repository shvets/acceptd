require "acceptd/routes_base"

require 'yaml'
require 'active_support/core_ext/hash'
require 'script_executor'
require 'rspec'

class Acceptd::AppRoutes < Acceptd::RoutesBase
  ACCEPTD_CONFIG_FILE_NAME = ".acceptd.yaml"
  WORKSPACE_DIR = 'workspace'

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
    result = execute_scripts params

    {result: result}.to_json
  end

  get '/stream_init' do
    session[:position] = 0
    session[:max] = 10

    result = execute_scripts params

    p result

    {done: session[:position] == session[:max], result: ""}.to_json
  end

  get '/stream_next' do
    session[:position] += 1

    # sleep 1

    p session[:buffer]

    {done: session[:position] == session[:max], result: "abc"}.to_json
  end

  helpers do
    def checked(current, value)
      (current == value) ? "checked" : ""
    end
  end

  private

  def load_config file_name
    config = {}

    projects = projects(WORKSPACE_DIR)

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

    config['workspace_dir'] = WORKSPACE_DIR
    config['projects'] = projects
    config['files'] = feature_files(WORKSPACE_DIR, config['selected_project'])

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

  def generate_spec_helper workspace_dir, selected_project
    tmp_dir = "tmp/#{selected_project}"
    spec_helper_filename = "#{tmp_dir}/spec_helper.rb"

    FileUtils.makedirs(tmp_dir)

    File.open(spec_helper_filename, "w") do |file|
      file.write <<-GROCERY_LIST
require 'acceptance_test/acceptance_config'

ENV['CONFIG_DIR'] = "#{workspace_dir}/#{selected_project}"
ENV['DATA_DIR'] = "#{workspace_dir}/#{selected_project}/acceptance_data"

AcceptanceConfig.instance.configure "#{workspace_dir}", app_name: "#{selected_project}",
                                    enable_external_source: true,
                                    ignore_case_in_steps: true
RSpec.configure do |c|
  c.add_formatter 'documentation'
end
      GROCERY_LIST
    end

    spec_helper_filename
  end

  def execute_scripts params
    ENV['DRIVER'] = params['driver']
    ENV['BROWSER'] = params['browser']
    ENV['TIMEOUT'] = params['timeout_in_seconds']

    selected_project = params['selected_project']
    selected_file = params['selected_file']

    scripts = if selected_file
                ["#{WORKSPACE_DIR}/#{selected_file}"]
              else
                selected_files = params['selected_files'].split(",")
                selected_files.collect {|selected_file| "#{WORKSPACE_DIR}/#{selected_file}"}
              end

    spec_helper_filename = generate_spec_helper WORKSPACE_DIR, selected_project

    basedir = "#{WORKSPACE_DIR}/#{selected_project}"

    rspec_params = "-r turnip/rspec -r acceptance_test/acceptance_config -I#{basedir} -I#{File.dirname(spec_helper_filename)}"

    executor = ScriptExecutor.new

    #session[:buffer] = executor.command.storage

    executor.execute script: "rspec #{rspec_params} #{scripts.join(' ')}",
                     capture_output: true, suppress_output: true
  end
end
