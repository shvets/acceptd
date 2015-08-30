(function () {
  'use strict';

  var namespace = angular.module('app.acceptd.service', [
    'app.settings'
  ]);

  namespace.factory('AcceptdService', function ($http, $q, $rootScope, Settings) {
    this.load_config = function () {
      var url = Settings.baseUrl + '/load_config';

      return $http.get(url).success(function (config) {
        $rootScope.$broadcast('selected_project', {selected_project: config.selected_project});
      });
    };

    this.load_project_config = function (fileName) {
      var url = Settings.baseUrl + "/load_project_config?" + "fileName=" + fileName;

      return $http.get(url).success(function (config) {
        $rootScope.$broadcast('selected_project', {selected_project: config.selected_project});
      });
    };

    this.save_config = function (config) {
      var url = Settings.baseUrl + '/save_config?' + this.buildParamsQuery(config);

      return $http.get(url);
    };

    this.feature_files = function (selected_project) {
      var url = Settings.baseUrl + '/feature_files?' +
          this.buildParamsQuery({selected_project: selected_project}, ['selected_project']);

      return $http.get(url);
    };

    this.run_tests = function (selectedFiles, config, onSuccess, onError, onComplete) {
      if (selectedFiles.indexOf(',') == -1) {
        selectedFiles = [selectedFiles];
      }
      else {
        selectedFiles = selectedFiles.split(',');
      }

      var paramsNames = [
        'selected_project', 'webapp_url', 'timeout_in_seconds', 'browser', 'driver', 'selected_files'
      ];

      var url = Settings.baseUrl + '/run?' + this.buildParamsQuery(config, paramsNames);

      var chain = $q.when();

      selectedFiles.forEach(function (selectedFile) {
        var currentUrl = url + '&selected_files=' + selectedFile;

        var handler = function (url) {
          return function () {
            return $http.get(url).then(onSuccess, onError);
          };
        };

        chain = chain.then(handler(currentUrl));
      });

      chain.then(onComplete);
    };

    this.buildParamsQuery = function (params, paramsNames) {
      var paramsQuery = '';

      angular.forEach(params, function (value, key) {
        var separator = (paramsQuery == '') ? '' : '&';

        if (paramsNames == undefined) {
          paramsQuery += separator + key + '=' + value;
        }
        else {
          if (paramsNames.indexOf(key) >= 0) {
            paramsQuery += separator + key + '=' + value;
          }
        }
      });

      return paramsQuery;
    };

    return this;
  });

})();