require 'acceptance_test/acceptance_config'

ENV['CONFIG_FILE'] = "workspace/wikipedia/acceptance_config.yml"
ENV['DATA_DIR'] = "workspace/wikipedia/acceptance_data"

AcceptanceConfig.instance.configure "workspace", "wikipedia"

RSpec.configure do |c|
  c.add_formatter 'progress'
#  c.add_formatter 'documentation'
end
