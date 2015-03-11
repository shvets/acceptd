(function () {
  "use strict";

  var namespace = angular.module("app");

  namespace.controller("MainController", MainController);

  function MainController($scope, $http) {
    this.get = function() {
      console.log("alex3");

      $http.get("http://localhost:9292/movie").success(function(result) {
        console.log("Success", result);
        $scope.result = result;
      }).error(function() {
        console.log("error");
      });
    };
  }

})();
