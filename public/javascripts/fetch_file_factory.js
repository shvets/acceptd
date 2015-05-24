(function () {
  'use strict';

  var namespace = angular.module("app");

  namespace.factory('FetchFileFactory', function ($http) {
    var _factory = {};

    _factory.fetchFile = function (file) {
      console.log(file);
      return $http.get("/file_browser/resource");
    };

    return _factory;
  });

}());