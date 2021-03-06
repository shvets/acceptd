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
        //.state('app', {
        //  abstract: true,
        //  templateUrl: '/app/acceptd/index.html'
        //})
      .state('home', {
            //parent: "app",
        url: '/',
            templateUrl: '/app/acceptd/home.html',
        controller: 'AcceptdController'
      })
      .state('config', {
            //parent: "app",
            url: '/config',
            templateUrl: '/app/acceptd/config.html',
        controller: 'ConfigController'
      });
  });

  namespace.run(function ($state) {
    $state.transitionTo('home');
  });

})();
