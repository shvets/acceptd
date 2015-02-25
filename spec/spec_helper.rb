ENV['CONFIG_FILE'] = "workspace/wikipedia/acceptance_config.yml"

require 'acceptance_test/acceptance_config'

$: << File.expand_path("workspace/support")

AcceptanceConfig.instance.configure "wikipedia"