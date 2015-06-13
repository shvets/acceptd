(function () {
  'use strict';

  var namespace = angular.module('app.acceptd.acceptd.controllers', [
    'app.settings',
    'app.acceptd.config',
    'app.acceptd.progressbar',
    'app.directory-selector'
  ]);

  namespace.controller('AcceptdController', AcceptdController);

  function AcceptdController($scope, $http, $q, $window, Settings, AcceptdService, Progressbar) {
    var self = this;

    this.scope = $scope;
    this.http = $http;
    this.q = $q;
    this.window = $window;

    this.settings = Settings;
    this.acceptdService = AcceptdService;
    this.progressbar = Progressbar;

    this.scope.progressbar = this.progressbar;

    this.scope.script_params = {};
    this.scope.result = '';
    this.scope.running_script = false;

    this.acceptdService.load_config().success(function (config) {
      $scope.script_params = config;

      self.acceptdService.feature_files(config).success(function (feature_files) {
        $scope.feature_files = feature_files;
      });
    });

    this.scope.$watch('$viewContentLoaded', function () {

    });
  }

  AcceptdController.prototype.save_config = function () {
    this.acceptdService.save_config(this.scope.script_params);
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

    var onSuccess = function (result) {
      self.scope.result += result.data;
    };

    var onError = function (result) {
      self.scope.result += result.data;

      self.progressbar.error();
    };

    var onComplete = function () {
      self.progressbar.stop();
    };

    var selectedFiles = this.scope.script_params.selected_files;

    this.progressbar.start();

    self.acceptdService.run_tests(selectedFiles, this.scope.script_params, onSuccess, onError, onComplete);
  };

})();

