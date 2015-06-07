(function () {
  "use strict";

  var namespace = angular.module("app");

  namespace.controller("AcceptdController", AcceptdController);

  function AcceptdController($scope, $http, $q, $timeout, Settings, $window, ConfigService, Progressbar) {
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

    $scope.tagName = function (item) {
      return item.id;
    };

    $scope.testa = function () {
      //angular.element(document.body).injector().get('AcceptdController')

      var root = $('.hierarchical-control');
      var root_input = $('.hierarchical-input');
      var tree_view = root.find('.tree-view');

      root_input.click();

      var items = tree_view.find('ul li');

      for (var i = 0; i < items.size(); i++) {
        var item = items[0];
        console.log(item);
        var el1 = $(item).find('.item-container span')[0];
        el1.click();
        var item2 = item.find('ul li');
        var el2 = item2.find('.item-container span')[0];
      }
    };

    $scope.$watch('$viewContentLoaded', function () {
      self.configService.load_config($scope.script_params).success(function (result) {
        var id = result.workspace_dir;

        $http.get('/file_browser/node' + '?id=' + id).success(function (data) {
          //data["_hsmeta"] = {"isExpanded":false,"isActive":false,"selected":true};
          $scope.selection = data;
        });
      });
    });

    $scope.onSelectionChanged = function (items) {
      $scope.mySelection = items;
    };

    // Needs to return an array of items or a promise that resolves to an array of items.
    $scope.loadAsyncData = function (parent) {
      var defer = $q.defer();

      var url = '/file_browser/tree';

      var id;

      if (!parent) {
        id = '/';
      }
      else {
        id = parent.id;
      }

      $http.get(url + '?id=' + id).success(function (data) {
        defer.resolve(data);
      });

      return defer.promise;
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

