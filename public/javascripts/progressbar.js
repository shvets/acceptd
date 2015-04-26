(function () {
  "use strict";

  var namespace = angular.module("app");

  namespace.factory('Progressbar', function($interval) {
    var control = {};

    control.value = 0;
    control.status = 'new';

    var ticker = null;

    var increment = function() {
      control.value = control.value + 10;

      if(control.value == 100) {
        control.value = 0;
      }
    };

    return {
      control: function() {
        return control;
      },

      start: function(callbackFunction) {
        control.value = 0;
        control.status = 'started';

        ticker = $interval(function () {
          increment();

          if(callbackFunction) {
            callbackFunction();
          }
        }, 2000);
      },

      stop: function() {
        control.status = 'success';
        control.value = 100;

        $interval.cancel(ticker);
        ticker = null;
      },

      error: function() {
        control.status = 'error';
      },

      status: function() {
        return control.status;
      }
    };
  });

})();
