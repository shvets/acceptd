require "acceptd/routes_base"

require 'yaml'
require 'active_support/core_ext/hash'
require 'script_executor'
require 'rspec'
require 'erb'

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

    # result = execute_scripts params

    # p result

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

  def generate_spec_helper workspace_dir, params
    binding.local_variable_set(:workspace_dir, workspace_dir)

    driver = params['driver']
    browser = params['browser']
    timeout_in_seconds = params['timeout_in_seconds']
    selected_project = params['selected_project']

    template = ERB.new(File.read('lib/acceptd/spec_helper.rb.erb'))

    tmp_dir = "tmp/#{selected_project}"
    spec_helper_filename = "#{tmp_dir}/spec_helper.rb"

    FileUtils.makedirs(tmp_dir)

    File.open(spec_helper_filename, "w") do |file|
      file.write template.result(binding)
    end

    spec_helper_filename
  end

  def execute_scripts params
    selected_script_index = params['selected_script_index']
    selected_files = params['selected_files'].split(",")

    scripts = selected_files.collect {|file| "#{WORKSPACE_DIR}/#{file}"}

    if selected_script_index
      execute_script scripts[selected_script_index], params
    else
      result = ""

      scripts.each do |script|
        result += execute_script(script, params)
        result += "\n"
      end

      result
    end
  end

  def execute_script script, params
    ENV['DRIVER'] = params['driver']
    ENV['BROWSER'] = params['browser']
    ENV['TIMEOUT'] = params['timeout_in_seconds']

    selected_project = params['selected_project']

    spec_helper_filename = generate_spec_helper WORKSPACE_DIR, params

    basedir = "#{WORKSPACE_DIR}/#{selected_project}"

    rspec_params = "-r turnip/rspec -I#{basedir} -I#{File.dirname(spec_helper_filename)}"

    executor = ScriptExecutor.new

    output_stream = StringIO.new

    begin
      executor.execute script: "rspec #{rspec_params} #{script}", output_stream: output_stream
    ensure
      output_stream.close
    end

    output_stream.string
  end
end
