(function () {
  'use strict';

  var namespace = angular.module('app.acceptd.config.controllers', [
    'app.acceptd.config'
  ]);

  namespace.controller('ConfigController', ConfigController);

  function ConfigController($scope, $http, $q, $window, AcceptdService) {
    this.scope = $scope;
    this.http = $http;
    this.q = $q;

    this.window = $window;
    this.acceptdService = AcceptdService;

    this.scope.script_params = {};
    this.scope.result = '';

    AcceptdService.load_config().then(function (result) {
      $scope.script_params = result.data;
    });
  }

  ConfigController.prototype.save_and_navigate_to_home = function () {
    this.acceptdService.save_config(this.scope.script_params);

    this.window.location = '/';
  };

})();

