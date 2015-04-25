(function () {
  "use strict";

  var namespace = angular.module("app");

  namespace.value("Progressbar", Progressbar);

  function Progressbar(parent, $interval) {
    this.parent = parent;

    this.interval = $interval;

    this.control = {};

    this.control.value = 0;
    this.control.status = 'new';
  }

  Progressbar.prototype.start = function(callbackFunction) {
    var self = this;

    this.control.value = 0;
    this.control.status = 'new';

    this.ticker = this.interval(function () {
      callbackFunction.call();
      self.increment();
    }, 2000);

    //this.parent.scope.$on('$destroy', function() {
    //  self.interval.cancel(self.ticker);
    //  //self.ticker = null;
    //});
  };

  Progressbar.prototype.stop = function() {
    this.control.status = 'success';
    this.control.value = 100;

    this.interval.cancel(this.ticker);
    this.ticker = null;
  };

  Progressbar.prototype.increment = function() {
    this.control.value = this.control.value+10;

    if(this.control.value == 100) {
      this.control.value = 0;
    }
  };

  Progressbar.prototype.error = function() {
    this.control.status = 'error';
  };

})();

