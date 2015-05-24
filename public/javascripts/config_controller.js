(function () {
  "use strict";

  var namespace = angular.module("app");

  namespace.controller("ConfigController", ConfigController);

  function ConfigController($scope, $http, $q, $window, ConfigService) {
    this.scope = $scope;
    this.http = $http;
    this.q = $q;

    this.window = $window;
    this.configService = ConfigService;

    this.scope.script_params = {};
    this.scope.result = "";

    var self = this;

    $scope.$watch('$viewContentLoaded', function () {
      self.configService.load_config($scope.script_params);
    });

    //$scope.treeModel = getTreeData();
    //
    //$scope.$watch('acceptd.currentNode', function (newObj, oldObj) {
    //  if ($scope.acceptd && angular.isObject($scope.acceptd.currentNode)) {
    //    //console.log( 'Node Selected!!' );
    //    //console.log( $scope.acceptd.currentNode );
    //  }
    //}, false);

    $scope.update_projects = function () {
      self.configService.projects($scope.script_params);
    };
  }

  //function getTreeData() {
  //  return [
  //    {
  //      "label": "User", "id": "role1", "children": [
  //      {"label": "subUser1", "id": "role11", "children": []},
  //      {
  //        "label": "subUser2", "id": "role12", "children": [
  //        {
  //          "label": "subUser2-1", "id": "role121", "children": [
  //          {"label": "subUser2-1-1", "id": "role1211", "children": []},
  //          {"label": "subUser2-1-2", "id": "role1212", "children": []}
  //        ]
  //        }
  //      ]
  //      }
  //    ]
  //    },
  //    {"label": "Admin", "id": "role2", "children": []},
  //    {"label": "Guest", "id": "role3", "children": []}
  //  ];
  //}

  ConfigController.prototype.save_and_navigate_to_home = function () {
    this.configService.save_config(this.scope.script_params);

    this.window.location = '/';
  };

})();

