(function () {
  'use strict';

  var namespace = angular.module('app.acceptd.acceptd.controllers', [
    'app.settings',
    'app.acceptd.config',
    'app.acceptd.progressbar',
    'app.directory-selector'
  ]);

  namespace.controller('AcceptdController', AcceptdController);

  function AcceptdController($scope, $http, $q, $window, $timeout, Settings, AcceptdService, Progressbar) {
    var self = this;

    this.scope = $scope;
    this.http = $http;
    this.q = $q;
    this.window = $window;

    this.settings = Settings;
    this.acceptdService = AcceptdService;
    this.progressbar = Progressbar;

    this.scope.progressbar = this.progressbar;

    this.scope.script_params = {};
    this.scope.result = '';
    this.scope.running_script = false;

    this.acceptdService.load_config().success(function (config) {
      $scope.script_params = config;

      self.acceptdService.feature_files(config).success(function (feature_files) {
        $scope.feature_files = feature_files;
      });
    });

    this.scope.$watch('$viewContentLoaded', function () {
    });

    function click_on_node(node, names, index, last) {
      var itemContainer = $(node).find('.item-container');

      var list = $(itemContainer).find('.item-details');

      for (var i = 0; i < list.size(); i++) {
        var name = $(list[i]).text().trim();

        if (name == names[index]) {
          var el = $(list[i]).siblings()[0];

          el.click();

          $(list[i]).addClass('selected');

          $timeout(function () {
            if (!last) {
              click_on_node(node.find('ul li'), names, index + 1, index === names.length - 1);
            }
          }, 50);
        }
      }
    }

    var index = 0;
    var hasRegistered = false;

    $scope.$watch(function () {
      if (hasRegistered) return;
      hasRegistered = true;
      // Note that we're using a private Angular method here (for now)
      $scope.$$postDigest(function (r) {
        hasRegistered = false;

        index += 1;

        if (index == 5) {
          var root_input = angular.element(document.querySelector('.hierarchical-control .hierarchical-input'));

          root_input.click();

          var tree_view = angular.element(document.querySelector('.hierarchical-control .tree-view'));
          var top_level = $(tree_view).find('.top-level');

          click_on_node(top_level, $scope.script_params.selected_project.split('/').slice(1, 10), 0, false);
        }
      });
    });
  }

  AcceptdController.prototype.save_config = function () {
    this.acceptdService.save_config(this.scope.script_params);
  };

  AcceptdController.prototype.navigate_to_config = function () {
    this.window.location = '/config';
  };

  AcceptdController.prototype.cancel_run = function() {
    if(this.progressbar && this.progressbar.status() == 'started') {
      this.progressbar.stop();
    }
  };

  AcceptdController.prototype.reset_session = function() {
    var url = this.settings.baseUrl + '/reset_session';

    var successHandler = function(result) {};

    var errorHandler = function(result) {};

    this.http.get(url).success(successHandler).error(errorHandler);
  };

  AcceptdController.prototype.run_script = function() {
    var self = this;

    this.scope.running_script = true;

    this.scope.result = '';

    var onSuccess = function (result) {
      self.scope.result += result.data;
    };

    var onError = function (result) {
      self.scope.result += result.data;

      self.progressbar.error();
    };

    var onComplete = function () {
      self.progressbar.stop();
    };

    var selectedFiles = this.scope.script_params.selected_files;

    this.progressbar.start();

    self.acceptdService.run_tests(selectedFiles, this.scope.script_params, onSuccess, onError, onComplete);
  };

})();

