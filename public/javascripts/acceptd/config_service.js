(function () {
  'use strict';

  var namespace = angular.module('app.acceptd.config', [
    'app.settings'
  ]);

  namespace.factory('ConfigService', function (Settings, $http) {

    this.load_config = function () {
      var url = Settings.baseUrl + '/load_config';

      return $http.get(url);
    };

    this.save_config = function (config) {
      var url = Settings.baseUrl + '/save_config?' + this.buildParamsQuery(config);

      return $http.get(url);
    };

    this.buildParamsQuery = function (params, paramsNames) {
      var paramsQuery = '';

      angular.forEach(params, function (value, key) {
        var separator = (paramsQuery == '') ? '' : '&';

        if (paramsNames == undefined) {
          paramsQuery += separator + key + '=' + value;
        }
        else {
          if (paramsNames.indexOf(key) >= 0) {
            paramsQuery += separator + key + '=' + value;
          }
        }
      });

      return paramsQuery;
    };

    return this;
  });

})();