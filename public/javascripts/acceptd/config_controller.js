(function () {
  'use strict';

  var namespace = angular.module('app.acceptd.config.controllers', []);

  namespace.controller('ConfigController', ConfigController);

  function ConfigController($scope, $http, $q, $window, ConfigService) {
    this.scope = $scope;
    this.http = $http;
    this.q = $q;

    this.window = $window;
    this.configService = ConfigService;

    this.scope.script_params = {};
    this.scope.result = '';

    var self = this;

    //$scope.$watch('$viewContentLoaded', function () {
    $scope.script_params = self.configService.get_config();
    //});
  }

  ConfigController.prototype.save_and_navigate_to_home = function () {
    this.configService.save_config();

    this.window.location = '/';
  };

})();

