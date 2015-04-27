(function () {
  "use strict";

  var namespace = angular.module("app");

  namespace.controller("ScriptParamsController", ScriptParamsController);

  function ScriptParamsController($scope, $http, $q, Settings, StreamService) {
    this.scope = $scope;
    this.http = $http;
    this.q = $q;

    this.settings = Settings;
    this.streamService = StreamService;

    this.scope.script_params = {};
    this.scope.result = "";

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

    this.progressbar = this.streamService.progressbar();
    this.scope.progressbar = this.progressbar.control();

    var url = this.settings.baseUrl + "/run?" + buildParamsQuery(this.scope.script_params, paramsNames);

    this.scope.result = "";

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

    var selectedFiles = this.scope.script_params.selected_files;

    if(selectedFiles.indexOf(",") == -1) {
      selectedFiles = [selectedFiles];
    }
    else {
      selectedFiles = selectedFiles.split(",");
    }

    for(var i=0; i < selectedFiles.length; i++) {
      var currentUrl = url + "&selected_file=" + selectedFiles[i];

      promises.push(this.http.get(currentUrl).success(addResultHandler).error(errorHandler));
    }

    this.progressbar.start();

    this.q.all(promises).finally(completeHandler);
  };

  ScriptParamsController.prototype.run_script2 = function() {
    var paramsNames = [
      'selected_project', 'webapp_url', 'timeout_in_seconds', 'browser', 'driver', 'selected_files'
    ];

    this.scope.result = "";

    var params = buildParamsQuery(this.scope.script_params, paramsNames);

    this.progressbar = this.streamService.progressbar();
    this.scope.progressbar = this.progressbar.control();

    var self = this;

    var updateFunction = function(result) {
      self.scope.result += result;
    };

    this.streamService.stream(this.settings.baseUrl, params, updateFunction);
  };

  ScriptParamsController.prototype.cancel_run = function() {
    if(this.progressbar && this.progressbar.status() == 'started') {
      this.progressbar.stop();
    }
  };

})();

