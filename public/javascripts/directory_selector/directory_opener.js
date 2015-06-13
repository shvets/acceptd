(function () {
  'use strict';

  var namespace = angular.module('app.directory-opener', []);

  namespace.service('DirectoryOpener', DirectoryOpener);

  function DirectoryOpener($rootScope, $timeout) {
    function click_first_node(selected_project) {
      var root_input = angular.element(document.querySelector('.hierarchical-control .hierarchical-input'));

      root_input.triggerHandler('click');

      var tree_view = angular.element(document.querySelector('.hierarchical-control .tree-view'));
      var top_level = tree_view.find('.top-level');

      var names = selected_project.split('/');

      click_next_node(top_level, names.slice(1, names.length), 0, names.length === 0);
    }

    function click_next_node(node, names, index) {
      var last = index === names.length - 1;

      var lastNode = null;
      var handlers = [];

      var itemContainer = node.find('.item-container');

      var list = itemContainer.find('.item-details');

      for (var i = 0; i < list.size(); i++) {
        var element = angular.element(list[i]);

        var name = element.text().trim();

        if (name == names[index]) {
          var expando = element.parent().children()[0];

          angular.element(expando).triggerHandler('click');

          if (last) {
            lastNode = list[i];
          }

          handlers.push(function () {
            var children = node.find('ul li');

            click_next_node(children, names, index + 1);
          });
        }
      }

      for (i = 0; i < handlers.length; i++) {
        $timeout(handlers[i], 30);
      }

      if (lastNode) {
        angular.element(lastNode).addClass('selected');

        lastNode.scrollIntoView(false);

        angular.element(lastNode).click();
      }

      angular.element('body').get(0).scrollIntoView();
    }

    this.open_selected_project = function (pos, selected_project) {
      var index = 0;
      var hasRegistered = false;

      $rootScope.$watch(function () {
        if (!hasRegistered) {
          hasRegistered = true;

          // Note that we're using a private Angular method here (for now)
          $rootScope.$$postDigest(function () {
            hasRegistered = false;

            index += 1;

            if (index == pos) {
              click_first_node(selected_project());
            }
          });
        }
      });
    }
  }

})();
