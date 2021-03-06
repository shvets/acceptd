(function () {
  'use strict';

  var namespace = angular.module('app.directory-selector', [
    'hierarchical-selector',
    'app.settings',
    'app.directory-opener',
    'app.acceptd.service'
  ]);

  namespace.directive('directorySelector', DirectorySelector);

  function DirectorySelector($q, $http, $rootScope, Settings, DirectoryOpener, AcceptdService) {
    return {
      restrict: 'AE',
      template: '<hierarchical-selector load-child-items="loadAsyncData(parent)"' +
      '  selection="selection" on-selection-changed="onSelectionChanged(items)"' +
      '  tag-name="tagName(item)">' +
      '</hierarchical-selector>',

      link: function (scope, element) {
        $rootScope.$on('selected_project', function (events, args) {
          var id = args.selected_project;

          $http.get(Settings.baseUrl + '/file_browser/node' + '?id=' + id).success(function (data) {
            scope.selection = data;
          });
        });

        DirectoryOpener.openSelectedProject(scope, element, 5, function () {
          return scope.script_params.selected_project;
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
          if (items !== undefined) {
            //scope.mySelection = items;
            var selected_project = items[0].id;

            AcceptdService.feature_files(selected_project).success(function (feature_files) {
              scope.feature_files = feature_files;
            });

            scope.script_params.selected_project = selected_project;

            AcceptdService.save_config(scope.script_params);
          }
        };

        scope.tagName = function (item) {
          return item.id;
        };
      }
    }
  }

})();


