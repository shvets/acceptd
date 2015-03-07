#!/usr/bin/env rake

require "rspec/core/rake_task"

include Rake::DSL

$LOAD_PATH.unshift File.expand_path("lib", File.dirname(__FILE__))

require "acceptd/version"
require "gemspec_deps_gen/gemspec_deps_gen"

version = Acceptd::VERSION
project_name = File.basename(Dir.pwd)

task :gen do
  generator = GemspecDepsGen.new

  generator.generate_dependencies "spec", "#{project_name}.gemspec.erb", "#{project_name}.gemspec"
end

task :build => :gen do
  system "gem build #{project_name}.gemspec"
end

task :install => :build do
  system "gem install #{project_name}-#{version}.gem"
end

task :uninstall do
  system "gem uninstall #{project_name}"
end

task :release => :build do
  system "gem push #{project_name}-#{version}.gem"
end

RSpec::Core::RakeTask.new do |task|
  task.pattern = 'spec/**/*_spec.rb'
  task.verbose = false
end

task :turnip do
  result = system "CONFIG_FILE=workspace/wikipedia/wikipedia.yml rspec -r acceptance_test/acceptance_config -r turnip/rspec workspace/wikipedia/features/search_with_drivers.feature"

  puts result
end
