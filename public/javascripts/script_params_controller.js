(function () {
  "use strict";

  var namespace = angular.module("app");

  namespace.controller("ScriptParamsController", ScriptParamsController);

  function ScriptParamsController($scope, $http, Settings) {
    this.scope = $scope;
    this.http = $http;
    this.settings = Settings;

    this.scope.scriptParams = {};

    var self = this;

    $scope.$watch('$viewContentLoaded', function() {
      self.config();
    });
  }

  function buildParamsQuery(params) {
    var paramsQuery = "";

    angular.forEach(params, function(value, key) {
      var separator = (paramsQuery == "") ? "" : "&";

      paramsQuery += separator + key + "=" + value;
    });

    return paramsQuery;
  }

  ScriptParamsController.prototype.config = function() {
    var self = this;

    var url = this.settings.baseUrl + "/config";

    var successHandler = function(result) {
      self.scope.scriptParams.projects = result.projects;
      self.scope.scriptParams.selectedProject = result.projects[0];
      self.scope.scriptParams.webapp_url = result.webapp_url;
      self.scope.scriptParams.timeout_in_seconds = result.timeout_in_seconds;
      self.scope.scriptParams.browser = result.browser;
      self.scope.scriptParams.driver = result.driver;
      self.scope.scriptParams.files = result.files;
      self.scope.scriptParams.selectedFiles = result.files;
    };

    var errorHandler = function(result) { };

    this.http.get(url).success(successHandler).error(errorHandler);
  };

  ScriptParamsController.prototype.save = function() {
    var url = this.settings.baseUrl + "/save?" + buildParamsQuery(this.scope.scriptParams);

    var successHandler = function(result) {};

    var errorHandler = function(result) {};

    this.http.get(url).success(successHandler).error(errorHandler);
  };

  ScriptParamsController.prototype.load = function() {
    var url = this.settings.baseUrl + "/load";

    var successHandler = function(result) {};

    var errorHandler = function(result) {};

    this.http.get(url).success(successHandler).error(errorHandler);
  };

  ScriptParamsController.prototype.run_script = function() {
    var self = this;

    var url = this.settings.baseUrl + "/run?" + buildParamsQuery(this.scope.scriptParams);

    var successHandler = function(result) {
      console.log("Success", result);
      self.scope.result = result;
    };

    var errorHandler = function(result) {
      console.log("error " + result);
    };

    this.http.get(url).success(successHandler).error(errorHandler);
  };

})();
