(function () {
  'use strict';

  var namespace = angular.module('app.acceptd.stream-service', []);

  namespace.factory('StreamService', function($http, Progressbar) {
    return {
      progressbar: function() {
        return Progressbar;
      },

      stream: function(baseUrl, params, updateFunction) {

        var successHandler = function(result) {
          if(result.done) {
            Progressbar.stop();
          }
          else {
            if(updateFunction) {
              updateFunction(result.result);
            }
          }
        };

        var errorHandler = function() {
          Progressbar.error();
        };

        var url1 = baseUrl + '/stream_init?' + params;
        var url2 = baseUrl + '/stream_next?' + params;

        function callAtInterval() {
          $http.get(url2).success(successHandler).error(errorHandler);
        }

        Progressbar.start(callAtInterval);

        $http.get(url1).success(successHandler).error(errorHandler);
      }
    };
  });

})();

