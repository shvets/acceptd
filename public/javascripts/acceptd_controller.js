(function () {
  "use strict";

  var namespace = angular.module("app");

  namespace.controller("AcceptdController", AcceptdController);

  function AcceptdController($scope, $http, $q, Settings, StreamService) {
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

    $scope.treeModel = getTreeData();

    $scope.$watch( 'acceptd.currentNode', function( newObj, oldObj ) {
      if( $scope.acceptd && angular.isObject($scope.acceptd.currentNode) ) {
        //console.log( 'Node Selected!!' );
        //console.log( $scope.acceptd.currentNode );
      }
    }, false);
  }

  function getTreeData() {
    return [
      { "label" : "User", "id" : "role1", "children" : [
        { "label" : "subUser1", "id" : "role11", "children" : [] },
        { "label" : "subUser2", "id" : "role12", "children" : [
          { "label" : "subUser2-1", "id" : "role121", "children" : [
            { "label" : "subUser2-1-1", "id" : "role1211", "children" : [] },
            { "label" : "subUser2-1-2", "id" : "role1212", "children" : [] }
          ]}
        ]}
      ]},
      { "label" : "Admin", "id" : "role2", "children" : [] },
      { "label" : "Guest", "id" : "role3", "children" : [] }
    ];
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

  AcceptdController.prototype.load_config = function() {
    var self = this;

    var url = this.settings.baseUrl + "/load_config";

    var successHandler = function(result) {
      self.scope.script_params.projects = result.projects;
      self.scope.script_params.workspace_dir = result.workspace_dir;
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

  AcceptdController.prototype.save_config = function() {
    var url = this.settings.baseUrl + "/save_config?" + buildParamsQuery(this.scope.script_params);

    var successHandler = function(result) {};

    var errorHandler = function(result) {};

    this.http.get(url).success(successHandler).error(errorHandler);
  };

  AcceptdController.prototype.cancel_run = function() {
    if(this.progressbar && this.progressbar.status() == 'started') {
      this.progressbar.stop();
    }
  };

  AcceptdController.prototype.reset_session = function() {
    var url = this.settings.baseUrl + "/reset_session";

    var successHandler = function(result) {};

    var errorHandler = function(result) {};

    this.http.get(url).success(successHandler).error(errorHandler);
  };

  AcceptdController.prototype.run_script = function() {
    var self = this;

    var paramsNames = [
      'workspace_dir', 'selected_project', 'webapp_url', 'timeout_in_seconds', 'browser', 'driver', 'selected_files'
    ];

    this.progressbar = this.streamService.progressbar();
    this.scope.progressbar = this.progressbar.control();

    var url = this.settings.baseUrl + "/run?" + buildParamsQuery(this.scope.script_params, paramsNames);

    this.scope.result = "";

    var addResultHandler = function(result) {
      self.scope.result += result.data;
    };

    var errorHandler = function(result) {
      self.scope.result += result.data;

      self.progressbar.error();
    };

    var completeHandler = function() {
      self.progressbar.stop();
    };

    var selectedFiles = this.scope.script_params.selected_files;

    if(selectedFiles.indexOf(",") == -1) {
      selectedFiles = [selectedFiles];
    }
    else {
      selectedFiles = selectedFiles.split(",");
    }

    this.progressbar.start();

    var chain = this.q.when();

    selectedFiles.forEach(function (selectedFile) {
      var currentUrl = url + "&selected_files=" + selectedFile;

      var handler = function(url) {
        return function() {
          return self.http.get(url).then(addResultHandler, errorHandler);
        };
      };

      chain = chain.then(handler(currentUrl));
    });

    chain.then(completeHandler);
  };

})();

