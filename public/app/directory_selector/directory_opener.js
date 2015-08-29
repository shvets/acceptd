(function () {
  'use strict';

  var namespace = angular.module('app.directory-opener', []);

  namespace.factory('DirectoryOpener', DirectoryOpener);

  function DirectoryOpener($timeout) {

    function click_first_node(element, names) {
      var root_input = element.find('.hierarchical-control .hierarchical-input');

      root_input.triggerHandler('click');

      var tree_view = angular.element(document.querySelector('.hierarchical-control .tree-view'));
      var top_level = tree_view.find('.top-level');

      var itemContainer = top_level.find('.item-container');

      var list = itemContainer.find('.item-details');

      var selectedIndex = find_selected_index(list, names[1]);

      click_next_node(top_level, list, selectedIndex, names.slice(1, names.length), 0, false);
    }

    function click_next_node(node, list, selectedIndex, names, index, last) {
      if (selectedIndex >= 0) {
        var elementToClick = angular.element(list[selectedIndex]);

        var expando = elementToClick.parent().children()[0];

        angular.element(expando).triggerHandler('click');
      }

      var handler = function () {
        var children = node.find('ul li');

        var itemContainer = node.find('.item-container');

        var list = itemContainer.find('.item-details');

        var selectedIndex = find_selected_index(list, names[index + 1]);

        click_next_node(children, list, selectedIndex, names, index + 1, index + 1 == names.length - 1);
      };

      $timeout(handler, 100).then(function () {
        if (last) {
          var lastNode = list[selectedIndex];

          var handler = function () {
            angular.element(lastNode).addClass('selected');

            lastNode.scrollIntoView(false);

            angular.element(lastNode).click();
          };

          $timeout(handler, 100);
        }
      });
    }

    function find_selected_index(list, selectedName) {
      var selectedIndex = -1;

      // Find next element in path to click on
      for (var i = 0; i < list.size(); i++) {
        var element = angular.element(list[i]);

        var name = element.text().trim();

        if (name == selectedName) {
          selectedIndex = i;

          break;
        }
      }

      return selectedIndex;
    }

    this.open_selected_project = function (scope, element, pos, selected_project) {
      var index = 0;
      var hasRegistered = false;

      scope.$watch(function () {
        if (!hasRegistered) {
          hasRegistered = true;

          // Note that we're using a private Angular method here (for now)
          scope.$$postDigest(function () {
            hasRegistered = false;

            index += 1;

            if (index == pos) {
              $timeout(function () {
                var path = selected_project();

                click_first_node(element, path.split('/'));
              }, 0);
            }
          });
        }
      });
    };

    return this;
  }

})();
