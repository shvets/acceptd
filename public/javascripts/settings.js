(function () {
  "use strict";

  var namespace = angular.module("app.settings", []);

  namespace.service("Settings", Settings);

  function Settings() {
    return {
      baseUrl : 'http://localhost:9292'
    };
  }

})();
