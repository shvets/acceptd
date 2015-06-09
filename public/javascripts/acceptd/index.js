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
        controller: 'AcceptdController',
        resolve: {
          testResolve: function () {
            console.log(testResolve);
          }
        }
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

//console.log('1');

// $http, ConfigService
//var deferred = $q.defer();
//
////$timeout(function(){
//  ConfigService.load_config({}).success(function (result) {
//  //var result = ConfigService.get_config();
//
//    var id = result.selected_project;
//
//    $http.get('/file_browser/node' + '?id=' + id).success(function (data) {
//      deferred.resolve(data);
//    });
//  });
////}, 0);
//
//return deferred.promise;