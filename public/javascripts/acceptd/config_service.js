(function () {
  "use strict";

  var namespace = angular.module('app.acceptd.config', []);

  namespace.factory("ConfigService", function (Settings, $http) {
    var self = this;

    this.config = {};

    this.get_config = function () {
      return self.config;
    };

    this.load_config = function () {
      var url = Settings.baseUrl + "/load_config";

      var successHandler = function (result) {
        self.config.projects = result.projects;
        self.config.selected_project = result.selected_project;
        self.config.webapp_url = result.webapp_url;
        self.config.timeout_in_seconds = result.timeout_in_seconds;
        self.config.browser = result.browser;
        self.config.driver = result.driver;
        self.config.feature_files = result.feature_files;
        self.config.selected_files = result.selected_files;
      };

      return $http.get(url).success(successHandler);
    };

    this.save_config = function () {
      var url = Settings.baseUrl + "/save_config?" + this.buildParamsQuery(this.config);

      return $http.get(url);
    };

    this.feature_files = function () {
      var url = Settings.baseUrl + "/feature_files?" + this.buildParamsQuery(this.config, ['selected_project']);

      $http.get(url);
    };

    this.buildParamsQuery = function (params, paramsNames) {
      var paramsQuery = "";

      angular.forEach(params, function (value, key) {
        var separator = (paramsQuery == "") ? "" : "&";

        if (paramsNames == undefined) {
          paramsQuery += separator + key + "=" + value;
        }
        else {
          if (paramsNames.indexOf(key) >= 0) {
            paramsQuery += separator + key + "=" + value;
          }
        }
      });

      return paramsQuery;
    };

    return this;
  });

})();