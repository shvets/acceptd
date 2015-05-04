require "acceptd/routes_base"

require 'yaml'
require 'active_support/core_ext/hash'
require 'script_executor'
require 'rspec'
require 'capybara'
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

  get '/reset_session' do
    Capybara.reset_sessions!
    #Capybara.current_session.driver.reset!
  end

  get '/run' do
    execute_scripts params
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
    ENV['DRIVER'] = params['driver']
    ENV['BROWSER'] = params['browser']
    ENV['TIMEOUT'] = params['timeout_in_seconds']

    selected_project = params['selected_project']

    spec_helper_filename = generate_spec_helper WORKSPACE_DIR, params

    basedir = "#{WORKSPACE_DIR}/#{selected_project}"

    rspec_params = "-r turnip/rspec -I#{basedir} -I#{File.dirname(spec_helper_filename)}"

    selected_files = params['selected_files'].split(",")

    scripts = selected_files.collect {|file| "#{WORKSPACE_DIR}/#{file}"}

    stream do |out|
      scripts.each do |script|
        out << run_rspec(rspec_params, script)
      end
    end
  end

  def run_rspec rspec_params, script
    output_stream = StringIO.new

    executor = ScriptExecutor.new

    begin
      executor.execute script: "rspec #{rspec_params} #{script}", output_stream: output_stream
    ensure
      output_stream.close
    end

    output_stream.string
  end

  def run_rspec2 rspec_params, script
    output_stream = StringIO.new

    argv = rspec_params.split(" ")
    argv << script

    create_rspec_reporter output_stream

    RSpec::Core::Runner.disable_autorun!

    begin
      RSpec::Core::Runner.run(argv, output_stream, output_stream)
    ensure
      output_stream.close
    end

    output_stream.string
  end

  def create_rspec_reporter output_stream
    config = RSpec.configuration

    formatter = RSpec::Core::Formatters::DocumentationFormatter.new(output_stream)

    reporter = RSpec::Core::Reporter.new(config)
    config.instance_variable_set(:@reporter, reporter)

    loader = config.send(:formatter_loader)
    notifications = loader.send(:notifications_for, RSpec::Core::Formatters::DocumentationFormatter)

    reporter.register_listener(formatter, *notifications)
  end

end
