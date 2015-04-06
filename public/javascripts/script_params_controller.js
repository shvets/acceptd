(function () {
  "use strict";

  var namespace = angular.module("app");

  namespace.controller("ScriptParamsController", ScriptParamsController);

  function ScriptParamsController($scope, $http, Settings, $timeout, $interval) {
    this.scope = $scope;
    this.http = $http;
    this.settings = Settings;
    this.timeout = $timeout;
    this.interval = $interval;

    this.scope.script_params = {};
    this.scope.progressbar = {value: 0, status: 'new'};

    var self = this;

    $scope.$watch('$viewContentLoaded', function() {
      self.load_config();
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

  function incrementProgressbar(progressbar) {
    progressbar.value = progressbar.value+10;

    if(progressbar.value == 100) {
      progressbar.value = 0;
    }
  }

  ScriptParamsController.prototype.load_config = function() {
    var self = this;

    var url = this.settings.baseUrl + "/load_config";

    var successHandler = function(result) {
      self.scope.script_params.projects = result.projects;
      self.scope.script_params.selected_project = result.selected_project;
      self.scope.script_params.webapp_url = result.webapp_url;
      self.scope.script_params.timeout_in_seconds = result.timeout_in_seconds;
      self.scope.script_params.browser = result.browser;
      self.scope.script_params.driver = result.driver;
      self.scope.script_params.files = result.files;
      self.scope.script_params.selected_files = result.selected_files;
    };

    var errorHandler = function(result) { };

    this.http.get(url).success(successHandler).error(errorHandler);
  };

  ScriptParamsController.prototype.save_config = function() {
    var url = this.settings.baseUrl + "/save_config?" + buildParamsQuery(this.scope.script_params);

    var successHandler = function(result) {};

    var errorHandler = function(result) {};

    this.http.get(url).success(successHandler).error(errorHandler);
  };

  ScriptParamsController.prototype.run_script = function() {
    var self = this;

    var url = this.settings.baseUrl + "/run?" + buildParamsQuery(this.scope.script_params);

    var intervalPromise;

    self.scope.start = function() {
      self.scope.progressbar.value = 0;
      self.scope.progressbar.status = 'new';

      intervalPromise = self.interval(function () {
          incrementProgressbar(self.scope.progressbar);
        },
        1000);
    };

    this.scope.$on('$destroy', function () {
      $interval.cancel(intervalPromise);
    });

    this.scope.complete = function () {
      self.scope.progressbar.value = 100;
      self.scope.progressbar.status = 'success';

      self.interval.cancel(intervalPromise);
    };

    this.scope.start();

    var successHandler = function(result) {
      self.scope.result = result;
      self.scope.complete();
    };

    var errorHandler = function() {
      self.scope.complete();
    };

    this.http.get(url).success(successHandler).error(errorHandler);
  };

})();
