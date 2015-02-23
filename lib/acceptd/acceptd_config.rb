require 'yaml'
require 'csv'
require 'active_support/core_ext/hash'
require 'acceptance_test'

require 'turnip/capybara'
require 'gnawrnip'

class AcceptdConfig
  def initialize
    target = nil

    ARGV.each do |arg|
      if arg =~ /.*\.feature/
        target = arg
      end
    end

    target_dir = File.dirname(target)
    support_dir = "#{target_dir}/../support"

    $: << File.expand_path('workspace/support')
    $: << File.expand_path(support_dir)

    Dir.entries("#{support_dir}/steps").each do |name|
      require "steps/#{File.basename(name)}" unless [".", ".."].include? name
    end
  end

  def configure
    acceptance_test = AcceptanceTest.instance

    RSpec.configure do |conf|
      conf.before(:type => :feature) do
        config_name = File.expand_path(ENV['CONFIG_FILE'])
        config = config_name ? HashWithIndifferentAccess.new(YAML.load_file(config_name)) : {}

        acceptance_test.configure(config)

        # acceptance_test.configure(webapp_url: 'http://www.wikipedia.org')
        # acceptance_test.register_driver(:webkit)
        # acceptance_test.register_driver(:poltergeist)

        acceptance_test.configure_turnip 'tmp/report.html', "test"

        acceptance_test.setup
      end

      conf.after(:type => :feature) do
        acceptance_test.teardown
      end
    end
  end
end

AcceptdConfig.new.configure
