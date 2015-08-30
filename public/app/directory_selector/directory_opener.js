(function () {
  'use strict';

  var namespace = angular.module('app.directory-opener', []);

  namespace.factory('DirectoryOpener', DirectoryOpener);

  function DirectoryOpener($timeout) {

    function clickFirstNode(element, names) {
      var root_input = element.find('.hierarchical-control .hierarchical-input');

      root_input.triggerHandler('click');

      var tree_view = angular.element(document.querySelector('.hierarchical-control .tree-view'));
      var top_level = tree_view.find('.top-level');

      var itemContainer = top_level.find('.item-container');

      var list = itemContainer.find('.item-details');

      var selectedIndex = findSelectedIndex(list, names[0]);

      if (selectedIndex >= 0) {
        clickNextNode(top_level, list, selectedIndex, names, 0);
      }
    }

    function clickNextNode(node, list, selectedIndex, names, index) {
      var elementToClick = angular.element(list[selectedIndex]);

      var expando = elementToClick.parent().children()[0];

      angular.element(expando).triggerHandler('click');

      var handler = function () {
        var children = node.find('ul li');

        var itemContainer = node.find('.item-container');

        var list = itemContainer.find('.item-details');

        var selectedIndex = findSelectedIndex(list, names[index + 1]);

        if (selectedIndex >= 0) {
          clickNextNode(children, list, selectedIndex, names, index + 1);
        }
      };

      var promise = $timeout(handler, 200);

      var last = index == names.length - 1;

      if (last) {
        promise.then(function () {
          var lastNode = list[selectedIndex];

          var handler = function () {
            angular.element(lastNode).addClass('selected');

            lastNode.scrollIntoView(false);

            angular.element(lastNode).click();
          };

          $timeout(handler, 200);
        });
      }
    }

    function findSelectedIndex(list, selectedName) {
      var selectedIndex = -1;

      angular.forEach(list, function (value, key) {
        var element = angular.element(value);

        var name = element.text().trim();

        if (name == selectedName) {
          selectedIndex = key;
        }
      });

      return selectedIndex;
    }

    this.openSelectedProject = function (scope, element, pos, selected_project) {
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
                var names = selected_project().split('/');

                clickFirstNode(element, names.slice(1, names.length));
              }, 0);
            }
          });
        }
      });
    };

    return this;
  }

})();
