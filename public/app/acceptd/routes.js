(function () {
  'use strict';

  angular.module('app.acceptd', [
    'app.acceptd.acceptd.controllers',
    'app.acceptd.config.controllers'
  ]);

  var namespace = angular.module('app.routes.acceptd', [
    'app.acceptd'
  ]);

  namespace.config(function ($stateProvider) {
    $stateProvider
      .state('home', {
        url: '/',
        templateUrl: '/index.html',
          controller: 'AcceptdController'
        })
        .state('config', {
          url: '/config.html',
          templateUrl: '/config.html',
          controller: 'ConfigController'
      });
  });

  namespace.run(function ($state) {
    $state.transitionTo('home');
  });

})();
