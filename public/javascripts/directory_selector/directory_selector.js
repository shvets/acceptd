(function () {
  "use strict";

  var namespace = angular.module("app");

  namespace.directive("directorySelector", DirectorySelector);

  function DirectorySelector($q, $http, $timeout, ConfigService) {
    return {
      restrict: 'AE',
      template: '<hierarchical-selector load-child-items="loadAsyncData(parent)"' +
      '                       selection="selection" on-selection-changed="onSelectionChanged(items)"' +
      '                       tag-name="tagName(item)">' +
      '</hierarchical-selector>',
      scope: {
        "script_params": "&",
        "selection": "&"
      },
      link: function (scope) {
        ConfigService.load_config(scope.script_params).success(function (result) {
          var id = result.selected_project;

          $http.get('/file_browser/node' + '?id=' + id).success(function (data) {
            //  //data["_hsmeta"] = {"isExpanded":false,"isActive":false,"selected":true};
            scope.selection = data;
          });
        });

        scope.loadAsyncData = function (parent) {
          var id = parent ? parent.id : '/';

          var defer = $q.defer();

          $http.get('/file_browser/tree' + '?id=' + id).success(function (data) {
            defer.resolve(data);
          }).error(function (data) {
            defer.reject(data);
          });

          return defer.promise;
        };

        scope.onSelectionChanged = function (items) {
          scope.mySelection = items;
        };

        scope.tagName = function (item) {
          return item.id;
        };
      }
    }
  }

})();

//$scope.testa = function () {
//  //angular.element(document.body).injector().get('AcceptdController')
//
//  //var root = angular.element(document.querySelector('.hierarchical-control'));
//  //var root_input = angular.element(document.querySelector('.hierarchical-input'));
//  //var tree_view = angular.element(document.querySelector('.tree-view'))
//
//  var root = $('.hierarchical-control');
//  var root_input = $('.hierarchical-input');
//  var tree_view = root.find('.tree-view');
//
//  root_input.click();
//
//  var items = tree_view.find('ul li');
//
//  for (var i = 0; i < items.size(); i++) {
//    var item = items[0];
//    console.log(item);
//    var el1 = $(item).find('.item-container span')[0];
//    el1.click();
//    var item2 = item.find('ul li');
//    var el2 = item2.find('.item-container span')[0];
//  }
//};

