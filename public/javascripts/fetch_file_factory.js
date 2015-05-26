(function () {
  'use strict';

  var namespace = angular.module("app");

  namespace.factory('FetchFileFactory', function ($http) {
    var factory = {};

    factory.fetchFile = function (file) {
      console.log(file);
      return $http.get("/file_browser/node?name=" + file);
    };

    return factory;
  });

}());