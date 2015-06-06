(function () {
  "use strict";

  var namespace = angular.module("app");

  namespace.controller("AcceptdController", AcceptdController);

  function AcceptdController($scope, $http, $q, Settings, $window, ConfigService, Progressbar) {
    this.scope = $scope;
    this.http = $http;
    this.q = $q;

    this.settings = Settings;
    this.window = $window;
    this.configService = ConfigService;
    this.progressbar = Progressbar;

    this.scope.progressbar = this.progressbar;

    this.scope.script_params = {};
    this.scope.result = "";
    this.scope.running_script = false;

    var self = this;

    $scope.$watch('$viewContentLoaded', function() {
      var url = '/file_browser/node';

      self.configService.load_config($scope.script_params).then(function (result) {

        var workspace_dir = result.data.workspace_dir;

//        var files = workspace_dir.substring(1, workspace_dir.length).split("/");
//
//        var id = "";
//
//        for(var i=0; i < files.length; i++) {
//          id += "/" + files[i];
//
//          console.log(id);
//
//          $http.get(url + '?id=' + id).success(function (data) {
//            $scope.selection = data;
//          });
////
////        //var selector = $(document.getElementById(id)).find("i");
////
////        //var selector = $("li[id=" + id + "] i.jstree-ocl");
////        //
////        //selector.click();
////
//        }

        //var id = $scope.script_params.workspace_dir;
        //var id = workspace_dir;
        //var id = '/Users/alex';
        //
        //$http.get(url + '?id=' + id).success(function (data) {
        //  $scope.selection = data;
        //});
      });

      //var id = '/Users';
      //
      //$http.get(url + '?id=' + id).success(function (data) {
      //  $scope.selection = data;
      //});

      //$scope.selection = {"id":"/Users/alex","name":"alex","hasChildren":true};
      $scope.selection = [{
        "id": "/Users/alex",
        "name": "alex",
        "hasChildren": true,
        "_hsmeta": {"isExpanded": true, "isActive": true, "selected": true}
      }]
    });

    $scope.onSelectionChanged = function (items) {
      //$scope.selection = items;
      //var str = '';
      //if (items) {
      //  var itemNames = [];
      //  for (var i = 0; i < items.length; i++) {
      //    itemNames.push(items[i].name);
      //  }
      //
      //  str = itemNames.join(', ');
      //}
      //return str;
    };

    // Needs to return an array of items or a promise that resolves to an array of items.
    $scope.loadAsyncData = function (parent) {
      var defer = $q.defer();

      var url = '/file_browser/tree';

      var id;

      if (!parent) {
        id = '/';
      }
      else {
        id = parent.id;
      }

      $http.get(url + '?id=' + id).success(function (data) {
        console.log(data[0]);
        defer.resolve(data);
      });

      return defer.promise;
    };

    function selectNode() {
      var workspace_dir = $scope.script_params.workspace_dir;

      var t = $("#project_location").jstree(true);

      //$("#project_location").one("refresh.jstree", function () {
      //  t.load_node('/System');
      //  t.load_node('/System/Library');
      //
      //  t.open_node('/System');
      //  t.select_node('/System');
      //
      //  t.open_node('/System/Library');
      //  t.select_node('/System/Library');
      //});
      //
      //t.refresh();

      //t._data.core.selected = '/System/Library';
      ////t.trigger('changed', { 'action' : 'ready', 'selected' : ['/System/Library'] });

      //var selector = $(document.getElementById('/System/Library' + "_anchor"));
      //
      //$("#project_location").jstree("select_node", selector);
      //
      //console.log("restoreState " + $("#project_location").jstree("get_selected"));
    }

    //core' : {
    //*			'data' : {
    //*				'url' : '/get/children/',
    //*				'data' : function (node) {
    //  *					return { 'id' : node.id };
    //  *				}

    $('#project_location').on('ready.jstree', function () {
      console.log("aaa");
    });

    $scope.initTree = function () {
      console.log("initTree");
    };

    $scope.loadAll = function () {
      console.log("loadAll");
    };

    $scope.loadNode = function () {
      console.log("loadNode");
    };

    $scope.loadedTree = function () {
      console.log("loadedTree");

      var t = $("#project_location").jstree(true);

      //t._data.core.data.data = function(node) {
      //  console.log("alex ");
      //};
    };

    $scope.treeReady = function () {
      console.log($scope.script_params.workspace_dir);

      selectNode();
    };

    //$scope.$watch('jsTree', function(v) {
    //  console.log("#loadedTree");
    //});

//    $scope.setState = function (result) {
//      console.log("setState");
//
//      //$("#project_location").jstree("select_node", "/Users/alex");
//
////      //var id = "/Users";
////      //var selector = $(document.getElementById(id)).find("i");
////      //
////      //selector.click();
////
//      var workspace_dir = $scope.workspace_dir;
//
//
//      //var selector = $(document.getElementById(id + "_anchor"));
//      //
//      //  $("#project_location").jstree("open_node", selector);
//      //  $("#project_location").jstree("select_node", selector);
//
//      var result = workspace_dir.substring(1, workspace_dir.length).split("/");
//
//      var id = "";
//
//      for(var i=0; i < result.length; i++) {
//        id += "/" + result[i];
//
//        //var selector = $(document.getElementById(id)).find("i");
//
//        //var selector = $("li[id=" + id + "] i.jstree-ocl");
//        //
//        //selector.click();
//
//        //console.log(id);
//        //
//        //var current_selection = $("#project_location").jstree("get_selected");
//        //
//        //var selector = $(document.getElementById(id + "_anchor"));
//
//        var selector = $(id.sub('/', '\\/'));
//
//        $("#project_location").jstree("open_node", selector);
//        $("#project_location").jstree("select_node", selector);
//        //
//        //$("#project_location").jstree("deselect_node", current_selection);
//      }
//
//      //$(document.getElementById('/Users/alex/Books_anchor'))
//    };

    $scope.nodeSelected = function (e, data) {

      var _l = data.node.li_attr;

      console.log(_l);

//      var _l = data.node.li_attr;
      if (!_l.isLeaf) {
        $scope.$apply(function () {
          //$scope.script_params.workspace_dir = _l.id;
        });
      }
//      if (_l.isLeaf) {
//        FetchFileFactory.fetchFile(_l.base).then(function (data) {
//          var _d = data.data;
//          if (typeof _d == 'object') {
////http://stackoverflow.com/a/7220510/1015046//
//            _d = JSON.stringify(_d, undefined, 2);
//          }
//          $scope.fileViewer = _d;
//        });
//      } else {
////http://jimhoskins.com/2012/12/17/angularjs-and-apply.html//
//        $scope.$apply(function () {
//          $scope.fileViewer = 'Please select a file to view its contents';
//        });
//      }
    };

    $scope.typesConfig = {
      "default": {
        //"icon": "/jstree/imgs/tree.png"
      },
      "home_folder": {
        "icon": "glyphicon glyphicon-tent"
      },
      "top_folder": {
        "icon": "glyphicon glyphicon-folder-close"
      },
      "folder": {
        "icon": "glyphicon glyphicon-folder-close"
      },
      "file": {
        "icon": "glyphicon glyphicon-file"
      }
    }
  }

  AcceptdController.prototype.save_config = function () {
    this.configService.save_config(this.scope.script_params);
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
    var url = this.settings.baseUrl + "/reset_session";

    var successHandler = function(result) {};

    var errorHandler = function(result) {};

    this.http.get(url).success(successHandler).error(errorHandler);
  };

  AcceptdController.prototype.run_script = function() {
    var self = this;

    this.scope.running_script = true;

    var paramsNames = [
      'workspace_dir', 'selected_project', 'webapp_url', 'timeout_in_seconds', 'browser', 'driver', 'selected_files'
    ];

    var url = this.settings.baseUrl + "/run?" + this.configService.buildParamsQuery(this.scope.script_params, paramsNames);

    this.scope.result = "";

    var addResultHandler = function(result) {
      self.scope.result += result.data;
    };

    var errorHandler = function(result) {
      self.scope.result += result.data;

      self.progressbar.error();
    };

    var completeHandler = function() {
      self.progressbar.stop();
    };

    var selectedFiles = this.scope.script_params.selected_files;

    if(selectedFiles.indexOf(",") == -1) {
      selectedFiles = [selectedFiles];
    }
    else {
      selectedFiles = selectedFiles.split(",");
    }

    this.progressbar.start();

    var chain = this.q.when();

    selectedFiles.forEach(function (selectedFile) {
      var currentUrl = url + "&selected_files=" + selectedFile;

      var handler = function(url) {
        return function() {
          return self.http.get(url).then(addResultHandler, errorHandler);
        };
      };

      chain = chain.then(handler(currentUrl));
    });

    chain.then(completeHandler);
  };

})();

