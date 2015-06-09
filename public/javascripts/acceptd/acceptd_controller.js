(function () {
  'use strict';

  var namespace = angular.module('app.acceptd.acceptd.controllers', [
    'app.settings',
    'app.acceptd.config',
    'app.acceptd.progressbar',
    'app.directory-selector'
  ]);

  namespace.controller('AcceptdController', AcceptdController);

  function AcceptdController($scope, $http, $q, $window, Settings, ConfigService, Progressbar) {
    this.scope = $scope;
    this.http = $http;
    this.q = $q;
    this.window = $window;

    this.settings = Settings;
    this.configService = ConfigService;
    this.progressbar = Progressbar;

    this.scope.progressbar = this.progressbar;

    this.scope.script_params = {};
    this.scope.result = '';
    this.scope.running_script = false;

    this.configService.load_config().then(function (result) {
      $scope.script_params = result.data;
    });
    
    //this.scope.selection = selection;

    this.scope.$watch('$viewContentLoaded', function () {
    });
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
    var url = this.settings.baseUrl + '/reset_session';

    var successHandler = function(result) {};

    var errorHandler = function(result) {};

    this.http.get(url).success(successHandler).error(errorHandler);
  };

  AcceptdController.prototype.run_script = function() {
    var self = this;

    this.scope.running_script = true;

    this.scope.result = '';

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

    if (selectedFiles.indexOf(',') == -1) {
      selectedFiles = [selectedFiles];
    }
    else {
      selectedFiles = selectedFiles.split(',');
    }

    var paramsNames = [
      'selected_project', 'webapp_url', 'timeout_in_seconds', 'browser', 'driver', 'selected_files'
    ];

    var url = this.settings.baseUrl + '/run?' + this.configService.buildParamsQuery(paramsNames);

    this.progressbar.start();

    var chain = this.q.when();

    selectedFiles.forEach(function (selectedFile) {
      var currentUrl = url + '&selected_files=' + selectedFile;

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

