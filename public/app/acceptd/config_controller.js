(function () {
  'use strict';

  var namespace = angular.module('app.acceptd.config.controllers', [
    'app.acceptd.service'
  ]);

  namespace.controller('ConfigController', ConfigController);

  function ConfigController($scope, $http, $state, AcceptdService) {
    this.scope = $scope;
    this.http = $http;
    this.state = $state;

    this.acceptdService = AcceptdService;

    this.scope.script_params = {};
    this.scope.result = '';

    AcceptdService.load_config().success(function (params) {
      $scope.script_params = params;
    });
  }

  ConfigController.prototype.save_and_navigate_to_home = function () {
    this.acceptdService.save_config(this.scope.script_params);

    this.state.transitionTo('home');
  };

  ConfigController.prototype.load_project_config = function () {
    var self = this;

    this.acceptdService.load_project_config('/Users/alex/Dropbox/Alex/work/projects/acceptd/workspace/wikipedia/wikipedia.yml').success(function (params) {
      self.scope.script_params = params;
    });
  };

})();

