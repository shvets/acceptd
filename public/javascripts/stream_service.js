(function () {
  "use strict";

  var namespace = angular.module("app");

  namespace.factory('StreamService', function($http) {
    var self = this;

    return {
      stream: function(baseUrl, params, parent) {

        parent.progressbar.start();

        var successHandler = function(result) {
          if(result.done) {
            parent.progressbar.stop();
          }
          else {
            parent.scope.result += result.result;
          }
        };

        var errorHandler = function() {
          parent.progressbar.error();
        };

        var url1 = baseUrl + "/stream_init?" + params;
        var url2 = baseUrl + "/stream_next?" + params;

        var promise = $http.get(url1).success(successHandler).error(errorHandler);

        function callAtInterval() {
          $http.get(url2).success(successHandler).error(errorHandler);
        }

        promise.then(function() {
          parent.interval(callAtInterval, 2000);
        });
      }
    };
  });

})();

