Feature: Using Wikipedia

  @search_with_scenario_outline
  Scenario Outline: Searching with selenium for a term with submit (embedded data)

    Given I am on wikipedia.com
    When I enter word <keyword>
    And I click submit button
    Then I should see "<result>"

    Examples:
      | keyword  | result |
      | Capybara | Hydrochoerus hydrochaeris |
      | Wombat   | quadrupedal marsupials    |
      | Echidna  | Tachyglossidae |
