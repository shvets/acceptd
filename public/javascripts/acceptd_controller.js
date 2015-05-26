(function () {
  "use strict";

  var namespace = angular.module("app");

  namespace.controller("AcceptdController", AcceptdController);

  function AcceptdController($scope, $http, $q, Settings, $window, ConfigService, Progressbar, FetchFileFactory) {
    this.scope = $scope;
    this.http = $http;
    this.q = $q;

    this.settings = Settings;
    this.window = $window;
    this.configService = ConfigService;
    this.progressbar = Progressbar;

    this.scope.progressbar = this.progressbar;

    this.scope.script_params = {};
    this.scope.result = "";
    this.scope.running_script = false;

    var self = this;

    $scope.$watch('$viewContentLoaded', function() {
      self.configService.load_config($scope.script_params);
    });

    //$scope.fileViewer = 'Please select a file to view its contents';

    //$scope.dblClick = function (e, data) {
    //  console.log("dblclick");
    //
    //  //var instance = $.jstree.reference(this),
    //  //    node = instance.get_node(this);
    //  //....
    //};

    $scope.nodeChecked = function () {
      console.log("nodeChecked");
    };

    $scope.nodeSelected = function (e, data) {

      var _l = data.node.li_attr;

      console.log(_l);

//      var _l = data.node.li_attr;
      if (!_l.isLeaf) {
        $scope.$apply(function () {
          $scope.script_params.workspace_dir = _l.id;
        });
      }
//      if (_l.isLeaf) {
//        FetchFileFactory.fetchFile(_l.base).then(function (data) {
//          var _d = data.data;
//          if (typeof _d == 'object') {
////http://stackoverflow.com/a/7220510/1015046//
//            _d = JSON.stringify(_d, undefined, 2);
//          }
//          $scope.fileViewer = _d;
//        });
//      } else {
////http://jimhoskins.com/2012/12/17/angularjs-and-apply.html//
//        $scope.$apply(function () {
//          $scope.fileViewer = 'Please select a file to view its contents';
//        });
//      }
    };
  }

  AcceptdController.prototype.save_config = function () {
    this.configService.save_config(this.scope.script_params);
  };

  AcceptdController.prototype.navigate_to_config = function () {
    this.window.location = '/config';
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

    this.scope.running_script = true;

    var paramsNames = [
      'workspace_dir', 'selected_project', 'webapp_url', 'timeout_in_seconds', 'browser', 'driver', 'selected_files'
    ];

    var url = this.settings.baseUrl + "/run?" + this.configService.buildParamsQuery(this.scope.script_params, paramsNames);

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

