(function() {
  "use strict";

  var app = angular.module('app', ['ui.bootstrap', 'ui.router', 'hierarchical-selector']);

  app.config(function ($stateProvider) {
    $stateProvider
        .state('home', {
          url: '/',
          templateUrl: '/index.html',
          controller: 'AcceptdController'
          //resolve: {
          //  selection: function($q, $timeout, $http, ConfigService) {
          //    var deferred = $q.defer();
          //
          //    $timeout(function(){
          //      ConfigService.load_config({}).success(function (result) {
          //        var id = result.selected_project;
          //
          //        $http.get('/file_browser/node' + '?id=' + id).success(function (data) {
          //          deferred.resolve(data);
          //        });
          //      });
          //    }, 0);
          //
          //    return deferred.promise;
          //  }
          //}
        });
  });

  app.run(['$state', function ($state) {
    $state.transitionTo('home');
  }]);
})();
