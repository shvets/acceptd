(function () {
  'use strict';

  angular.module('app.acceptd', [
    'app.acceptd.acceptd.controllers',
    'app.acceptd.config.controllers',
    'app.acceptd.config',
    'app.acceptd.progressbar',
    'app.directory-selector'
  ]);

  var namespace = angular.module('app.routes.acceptd', [
    'app.acceptd.acceptd.controllers',
    'app.acceptd.config.controllers',
    'app.acceptd.config',
    'app.acceptd.progressbar',
    'hierarchical-selector',
    'ui.bootstrap',
    'app.routes'
  ]);

  namespace.config(function ($stateProvider) {
    $stateProvider
      .state('home', {
        url: '/',
        templateUrl: '/index.html',
        controller: 'AcceptdController',
        resolve: {
          testResolve: function () {
            //console.log('1');

            return '';

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
          }
        }
      });
  });

  namespace.run(function ($state, ConfigService) {
    //console.log('2');
    ConfigService.load_config();

    $state.transitionTo('home');
  });

})();
