require 'steps/common_steps'
require 'wikipedia_pages'

steps_for :search_with_pages do
  include CommonSteps

  attr_reader :flow

  def initialize *params
    puts Capybara.current_driver

    @flow = WikipediaPages.new(self)

    super
  end

  step :visit_home_page, "I am on wikipedia.com"

  step :enter_word, "I enter word :word"

end
