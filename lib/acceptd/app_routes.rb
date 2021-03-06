require "acceptd/routes_base"

require 'yaml'
require 'active_support/core_ext/hash'
require 'script_executor'
require 'rspec'
require 'capybara'
require 'erb'

class Acceptd::AppRoutes < Acceptd::RoutesBase

  # get '/stylesheet.css' do
  #   headers 'Content-Type' => 'text/css; charset=utf-8'
  #
  #   sass :"styles/stylesheet"
  # end

  # get '/' do
  #   send_file File.join(settings.public_dir, '/app/acceptd/index.html')
  # end

  # get '/config' do
  #   send_file File.join(settings.public_dir, '/app/acceptd/config.html')
  # end

  # get '/?:file_name?.html' do
  #   send_file File.join(settings.public_dir, "/app/acceptd/#{params[:file_name]}.html")
  # end

  get '/*/?:file_name?.js' do
    headers 'Content-Type' => 'application/javascript'

    path = params[:splat][0]

    path = "../#{path}" if path =~ /node_modules/

    send_file File.join(settings.public_dir, "#{path}/#{params[:file_name]}.js")
  end

  get '/*/?:file_name?.css' do
    headers 'Content-Type' => 'text/css; charset=utf-8'

    path = params[:splat][0]

    path = "../#{path}" if path =~ /node_modules/

    send_file File.join(settings.public_dir, "#{path}/#{params[:file_name]}.css")
  end

  get '/feature_files' do
    feature_files(params['selected_project']).to_json
  end

  get '/reset_session' do
    Capybara.reset_sessions!
    #Capybara.current_session.driver.reset!
  end

  get '/run' do
    begin
      execute_scripts params
    rescue Exception => e
      # status 500
      #
      # e.message

      json_status 500, e.message
    end
  end

  helpers do
    def checked(current, value)
      (current == value) ? "checked" : ""
    end
  end

  private

  def feature_files project
    files = Dir.glob("#{project}/**/*.feature")

    files.each_with_index do |file, index|
      files[index] = file[project.size+1..-1]
    end

    files
  end

  def execute_scripts params
    execute_scripts_as_cmd params
    #execute_scripts_inline params
  end

  def execute_scripts_as_cmd params
    selected_project = params[:selected_project]
    selected_files = params[:selected_files].split(",")
    basedir = "#{selected_project}"

    spec_helper_filename = generate_spec_helper params

    stream do |out|
      scripts = selected_files.collect { |file| "#{selected_project}/#{file}" }

      scripts.each do |script|
        rspec_params = "-r turnip/rspec "
        rspec_params += "-I#{basedir} "
        rspec_params += "-I#{File.dirname(spec_helper_filename)} "
        rspec_params += "--format RSpec::Core::Formatters::DocumentationFormatter"

        out << run_rspec_as_cmd(rspec_params, script)
      end
    end
  end

  def run_rspec_as_cmd rspec_params, script
    output_stream = StringIO.new

    executor = ScriptExecutor.new

    begin
      executor.execute script: "rspec #{rspec_params} #{script}", output_stream: output_stream
    ensure
      output_stream.close
    end

    output_stream.string
  end

  def execute_scripts_inline params
    selected_project = params[:selected_project]
    selected_files = params[:selected_files].split(",")
    basedir = "#{selected_project}"

    spec_helper_filename = generate_spec_helper params

    stream do |out|
      scripts = selected_files.collect { |file| "#{selected_project}/#{file}" }

      scripts.each do |script|
        rspec_params = "-r turnip/rspec "
        rspec_params += "-I#{basedir} "
        rspec_params += "-I#{File.dirname(spec_helper_filename)} "

        out << run_rspec_inline(rspec_params, script)
      end

      RSpec.clear_examples
    end
  end

  def run_rspec_inline rspec_params, script
    output_stream = StringIO.new

    RSpec::Core::Runner.disable_autorun!

    argv = rspec_params.split(" ")
    argv << script

    listener = register_rspec_reporter output_stream

    begin
      RSpec::Core::Runner.run(argv)
    rescue Exception => e
       puts e
    ensure
      unregister_rspec_reporter listener
      output_stream.close
    end

    output_stream.string
  end

  def generate_spec_helper params
    template = ERB.new(File.read('lib/acceptd/spec_helper.rb.erb'))

    spec_helper_filename = "tmp/#{params[:selected_project]}/spec_helper.rb"

    FileUtils.makedirs(File.dirname(spec_helper_filename))

    File.open(spec_helper_filename, "w") do |file|
      namespace = OpenStruct.new(
          driver: params[:driver],
          browser: params[:browser],
          timeout_in_seconds: params[:timeout_in_seconds],
          selected_project: params[:selected_project]
      )

      template_binding = namespace.instance_eval { binding }

      file.write template.result(template_binding)
    end

    spec_helper_filename
  end

  def register_rspec_reporter output_stream
    formatter_class = RSpec::Core::Formatters::DocumentationFormatter

    config = RSpec.configuration

    formatter = formatter_class.new(output_stream)

    reporter = RSpec::Core::Reporter.new(config)
    config.instance_variable_set(:@reporter, reporter)

    loader = config.send(:formatter_loader)
    notifications = loader.send(:notifications_for, formatter_class)

    reporter.register_listener(formatter, *notifications)

    formatter
  end

  def unregister_rspec_reporter listener
    config = RSpec.configuration

    reporter = config.instance_variable_get(:@reporter)

    loader = config.send(:formatter_loader)

    notifications = loader.send(:notifications_for, RSpec::Core::Formatters::DocumentationFormatter)

    listeners = reporter.instance_variable_get(:@listeners)

    notifications.each do |notification|
      listeners[notification.to_sym].delete listener
    end
  end

end
