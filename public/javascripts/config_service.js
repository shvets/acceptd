(function () {
  "use strict";

  var namespace = angular.module("app");

  namespace.factory("ConfigService", function (Settings, $http) {
    return {
      load_config: function (script_params) {
        var url = Settings.baseUrl + "/load_config";

        var successHandler = function (result) {
          script_params.projects = result.projects;
          script_params.selected_project = result.selected_project;
          script_params.webapp_url = result.webapp_url;
          script_params.timeout_in_seconds = result.timeout_in_seconds;
          script_params.browser = result.browser;
          script_params.driver = result.driver;
          script_params.feature_files = result.feature_files;
          script_params.selected_files = result.selected_files;
        };

        return $http.get(url).success(successHandler);
      },

      save_config: function (script_params) {
        var url = Settings.baseUrl + "/save_config?" + this.buildParamsQuery(script_params);

        return $http.get(url);
      },

      feature_files: function (script_params) {
        var url = Settings.baseUrl + "/feature_files?" + this.buildParamsQuery(script_params, ['selected_project']);

        $http.get(url);
      },

      buildParamsQuery: function (params, paramsNames) {
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
      }
    };
  });

})();