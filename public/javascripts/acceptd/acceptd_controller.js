(function () {
  'use strict';

  var namespace = angular.module('app.acceptd.acceptd.controllers', [
    'app.settings',
    'app.acceptd.config',
    'app.acceptd.progressbar',
    'app.directory-selector'
  ]);

  namespace.controller('AcceptdController', AcceptdController);

  function AcceptdController($scope, $http, $q, $window, Settings, AcceptdService, Progressbar) {
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

    //this.scope.selection = selection;

    this.scope.$watch('$viewContentLoaded', function () {
    });

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
          console.log($scope.script_params.selected_project);

          var root = angular.element(document.querySelector('.hierarchical-control'));
          var root_input = angular.element(document.querySelector('.hierarchical-input'));
          var tree_view = angular.element(document.querySelector('.tree-view'));

          console.log(root_input);

          root_input.click();

          var items = tree_view.find('ul li');

          for (var i = 0; i < items.size(); i++) {
            var item = items[i];
            var name = $(item).text().trim();

            //console.log($(item).text().trim());

            ///html/body/div/div/form/div/section[2]/div/div[2]/directory-selector/div/div[2]/ul/li[16]/div/span
            ///html/body/div/div/form/div/section[2]/div/div[2]/directory-selector/div/div[2]/ul/li[16]/ul[1]/li/div

            if (name == 'Users') {
              console.log(name);

              var el = angular.element(item).find('.item-container span')[0];

              console.log(el);

              el.click();

              var item2 = angular.element(item).find('.item-container ul li div span');

              //console.log(item2);

              //var el2 = item2.find('.item-container span')[0];
              //el2.click();
            }
          }
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

