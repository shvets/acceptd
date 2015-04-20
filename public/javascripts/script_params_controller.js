(function () {
  "use strict";

  var namespace = angular.module("app");

  namespace.controller("ScriptParamsController", ScriptParamsController);

  function ScriptParamsController($scope, $http, Settings, $timeout, $interval, StreamService, $q, Progressbar) {
    this.scope = $scope;
    this.http = $http;
    this.settings = Settings;
    this.timeout = $timeout;
    this.interval = $interval;
    this.streamService = StreamService;
    this.q = $q;

    this.scope.script_params = {};
    this.scope.result = "";

    this.progressbar = new Progressbar(this);

    this.scope.progressbar = this.progressbar.control;

    var self = this;

    $scope.$watch('$viewContentLoaded', function() {
      self.load_config();
    });
  }

  function buildParamsQuery(params, paramsNames) {
    var paramsQuery = "";

    angular.forEach(params, function(value, key) {
      var separator = (paramsQuery == "") ? "" : "&";

      if(paramsNames == undefined) {
        paramsQuery += separator + key + "=" + value;
      }
      else {
        if(paramsNames.indexOf(key) >= 0) {
          paramsQuery += separator + key + "=" + value;
        }
      }
    });

    return paramsQuery;
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

    var paramsNames = [
      'selected_project', 'webapp_url', 'timeout_in_seconds', 'browser', 'driver', 'selected_files'
    ];

    var url = this.settings.baseUrl + "/run?" + buildParamsQuery(this.scope.script_params, paramsNames);

    self.progressbar.start();

    var addResultHandler = function(result) {
      self.scope.result += result.result;
    };

    var errorHandler = function() {
      self.progressbar.error();
    };

    var completeHandler = function() {
      self.progressbar.stop();
    };

    var promises = [];

    var selectedFiles = this.scope.script_params.selected_files.split(",");

    for(var i=0; i < selectedFiles.length; i++) {
      var currentUrl = url + "&selected_file=" + selectedFiles[i];

      promises.push(this.http.get(currentUrl).success(addResultHandler).error(errorHandler));
    }

    this.q.all(promises).then(completeHandler);
  };

  ScriptParamsController.prototype.run_script2 = function() {
    var paramsNames = [
      'selected_project', 'webapp_url', 'timeout_in_seconds', 'browser', 'driver', 'selected_files'
    ];

    var params = buildParamsQuery(this.scope.script_params, paramsNames);

    this.streamService.stream(this.settings.baseUrl, params, this);
  };

})();

