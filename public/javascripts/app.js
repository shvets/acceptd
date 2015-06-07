(function() {
  "use strict";

  var app = angular.module('app', ['ui.bootstrap', 'ui.router', 'hierarchical-selector']);

  app.config(function ($stateProvider) {
    $stateProvider
        .state('home', {
          url: '/',
          templateUrl: '/index.html',
          controller: 'AcceptdController'
        });
  });

  app.run(['$state', function ($state) {
    $state.transitionTo('home');
  }]);
})();
