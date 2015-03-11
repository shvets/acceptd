(function () {
  "use strict";

  var namespace = angular.module("app");

  namespace.controller("MainController", MainController);

  var baseUrl = "http://localhost:9292";

  function MainController($scope, $http, Settings) {
    //this.get = function() {
    //  $http.get("http://localhost:9292/movie").success(function(result) {
    //    console.log("Success", result);
    //    $scope.result = result;
    //  }).error(function() {
    //    console.log("error");
    //  });
    //};

    this.run = function(p1, p2) {
      console.log(p1);
      console.log(p2);

      $http.get(Settings.baseUrl + "/run?p1="+p1+"&p2="+p2).success(function(result) {
        console.log("Success", result);
        $scope.result = result;
      }).error(function(result) {
        console.log("error " + result);
      });
    };
  }

})();
