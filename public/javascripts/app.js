(function() {
  'use strict';

  var app = angular.module('app', [
    'ui.bootstrap',
    'app.routes',
    'app.acceptd'
  ]);

  app.config(function ($locationProvider) {
    $locationProvider.html5Mode({
      enabled: true,
      requireBase: false
    });
  });

})();
