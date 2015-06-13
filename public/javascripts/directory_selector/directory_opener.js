(function () {
  'use strict';

  var namespace = angular.module('app.directory-opener', []);

  namespace.service('DirectoryOpener', DirectoryOpener);

  function DirectoryOpener($rootScope, $timeout) {
    function click_first_node(selected_project) {
      var root_input = angular.element(document.querySelector('.hierarchical-control .hierarchical-input'));

      root_input.click();

      var tree_view = angular.element(document.querySelector('.hierarchical-control .tree-view'));
      var top_level = tree_view.find('.top-level');

      click_next_node(top_level, selected_project.split('/').slice(1, 10), 0, false);
    }

    function click_next_node(node, names, index, last) {
      var lastNode = null;

      var itemContainer = node.find('.item-container');

      var list = itemContainer.find('.item-details');

      for (var i = 0; i < list.size(); i++) {
        var name = $(list[i]).text().trim();

        if (name == names[index]) {
          var el = $(list[i]).siblings()[0];

          el.click();

          if (last) {
            lastNode = list[i];
          }

          $timeout(function () {
            click_next_node(node.find('ul li'), names, index + 1, index === names.length - 2);
          }, 30);
        }
      }

      if (lastNode) {
        $(lastNode).addClass('selected');
        lastNode.scrollIntoView(false);

        $(lastNode).click();
      }

      $('body').get(0).scrollIntoView();
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
